import express from 'express'
import cors from 'cors';
import { Router, Request, Response } from 'express';
import * as io from 'socket.io';

import { PALAVRAS } from './PALAVRAS';
import { Palavra, TipoPalavra } from '../../src/shared/models/palavra';
import { Jogo } from '../../src/shared/models/jogo';

const app = express();
const route = Router()

app.use(cors());
app.use(express.json())

const JOGOS : Jogo[] = [];

route.get('/novo-jogo', (req: Request, res: Response) => {
  const palavras_jogo = PALAVRAS.split('\n').sort(() => 0.5 - Math.random()).slice(0, 20);

  let palavras : Palavra[] = [];
  for(var i=0;i<5;i++) palavras.push(new Palavra(palavras_jogo[i], TipoPalavra.AZUL));
  for(var i=5;i<10;i++) palavras.push(new Palavra(palavras_jogo[i], TipoPalavra.VERMELHA));
  for(var i=10;i<19;i++) palavras.push(new Palavra(palavras_jogo[i], TipoPalavra.BRANCA));
  palavras.push(new Palavra(palavras_jogo[19], TipoPalavra.PRETA));

  let jogo = new Jogo(1, palavras.sort(() => 0.5 - Math.random()), [], []);

  JOGOS.push(jogo);

  let tmp = structuredClone(jogo) //JOGO SÓ QUE SEM AS PALAVRAS REVELADAS
  for(var p of tmp.palavras){
    p.tipo = TipoPalavra.NAO_REVELADA;
  }

  res.json(tmp)
})

app.get('/jogo/:id', (req: Request, res: Response) => {
  let tmp = structuredClone(JOGOS[parseInt(req.params.id)]) //JOGO SÓ QUE SEM AS PALAVRAS REVELADAS
  for(var p of tmp.palavras){
    p.tipo = TipoPalavra.NAO_REVELADA;
  }

  res.json(tmp);
})

app.use(route)

const servidor = app.listen(3000, () => 'server running on port 3333')
const socket = new io.Server(servidor, {
  cors: {
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    credentials: false
  }
});

socket.on('connection', (socket) => {
  console.log('user connected');

  socket.on('escolha', (palavra: any) => {
    for(var p of JOGOS[0].palavras){
      if(p.texto == palavra.texto) { 
        let acertou = (palavra.time == 0 && p.tipo == TipoPalavra.VERMELHA) || (palavra.time == 1 && p.tipo == TipoPalavra.AZUL)
        socket.emit('selecionou', p, acertou); 
        // if((palavra.time == 0 && p.tipo == TipoPalavra.VERMELHA) || (palavra.time == 1 && p.tipo == TipoPalavra.AZUL)){

        // } else {
        //   // socket.emit('errou')
        // }
      }
    }
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
})