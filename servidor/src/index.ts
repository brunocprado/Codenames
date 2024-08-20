import express from 'express'
import cors from 'cors';
import { Router, Request, Response } from 'express';
import * as io from 'socket.io';

import { PALAVRAS } from './PALAVRAS';
import { Palavra, TipoPalavra } from '../../src/shared/models/palavra';
import { Jogo } from '../../src/shared/models/jogo';

const { OpenAI } = require('openai');

const openai = new OpenAI({apiKey: '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'});

const app = express();
const route = Router()

app.use(cors());
app.use(express.json())

const JOGOS : Map<string, Jogo> = new Map<string, Jogo>();

route.post('/novo-jogo', async (req: Request, res: Response) => {
  let fdc = PALAVRAS.split('\n');
  if(req.body.prompt != ""){
    const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini", 
        messages: [{ 
            role: "user", 
            content: `Gere uma lista de 26 palavras/nomes únicas que sejam relacionadas com : '${req.body.prompt}'. Envie somente uma lista somente com as palavras e sem números`
        }],
        stream: false
    });
    fdc = stream.choices[0].message.content.replace(".", "").split('\n')
  }

  const palavras_jogo = fdc.sort(() => 0.5 - Math.random()).slice(0, 25);
  console.log(palavras_jogo)

  let palavras : Palavra[] = [];
  for(var i=0;i<7;i++) palavras.push(new Palavra(palavras_jogo[i].trim(), TipoPalavra.AZUL));
  for(var i=7;i<14;i++) palavras.push(new Palavra(palavras_jogo[i].trim(), TipoPalavra.VERMELHA));
  for(var i=14;i<24;i++) palavras.push(new Palavra(palavras_jogo[i].trim(), TipoPalavra.BRANCA));
  palavras.push(new Palavra(palavras_jogo[24].trim(), TipoPalavra.PRETA));

  let jogo = new Jogo(Math.floor(Math.random() * 200), palavras.sort(() => 0.5 - Math.random()));

  JOGOS.set(jogo.id.toString(), jogo);

  res.json(jogo.id) //Retorna só o ID
})

app.post('/jogo', (req: Request, res: Response) => { //:id/:tipoJogador
  console.log(req.body, !req.body.id, req.body.tipoJogador)
  if(!req.body.id) res.json({})
  if(req.body.tipoJogador == 'ESPIAO'){
    res.json(JOGOS.get(req.body.id));
  } else {
    let tmp : Jogo = structuredClone(JOGOS.get(req.body.id))! //JOGO SÓ QUE SEM AS PALAVRAS REVELADAS
    for(var p of tmp.palavras){
      p.tipo = TipoPalavra.NAO_REVELADA;
    }
    res.json(tmp);
  }
})

app.use(route)

const servidor = app.listen(3000, '0.0.0.0', () => 'server running on port 3333')
const socketio = new io.Server(servidor, {
  cors: {
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    credentials: false
  }
});

//===================| SOCKET |===================//

socketio.on('connection', (socket) => {
  // console.log('usuário conectado');
  
  socket.on('entra-sala', (sala : string) => {
    socket.join(sala)
  })

  socket.onAny((tipo, dados) => {
    console.log(tipo,dados);
    // socket.broadcast.emit(r,t)

    if(tipo=='dica'){
      // socket.broadcast.to(dados.idJogo).emit('dica', dados);
      socketio.sockets.in(dados.idJogo).emit('dica', dados);
    }
    
  })

  socket.on('escolha', (dados: any) => {
    for(var p of JOGOS.get(dados.idJogo)!.palavras){
      if(p.texto == dados.texto) { 
        let acertou = (dados.time == 0 && p.tipo == TipoPalavra.VERMELHA) || (dados.time == 1 && p.tipo == TipoPalavra.AZUL)
        socketio.sockets.in(dados.idJogo).emit('selecionou', {palavra: p, acertou: acertou, time: dados.time});
        if(p.tipo == TipoPalavra.PRETA) {
          socketio.sockets.in(dados.idJogo).emit('acabou', {time: dados.time});
        }
      }
    }
  });

  socket.on('encerra-turno', (dados: any) => {
    socketio.sockets.in(dados.idJogo).emit('encerra-turno', {time: dados.time});
  });

  // socket.on('disconnect', function () {
  //   console.log('user disconnected');
  // });
})