import express from 'express'
import cors from 'cors';
import { Router, Request, Response } from 'express';

import { PALAVRAS } from './PALAVRAS';
import { Palavra, TipoPalavra } from '../../src/shared/models/Palavra';
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
  for(var i=10;i<20;i++) palavras.push(new Palavra(palavras_jogo[i], TipoPalavra.BRANCA));

  let jogo = new Jogo(1, palavras.sort(() => 0.5 - Math.random()), [], []);

  console.log(jogo)

  res.json(jogo)
})

app.use(route)

app.listen(3000, () => 'server running on port 3333')