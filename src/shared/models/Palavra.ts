export enum TipoPalavra {
  VERMELHA, AZUL, BRANCA, PRETA
}
export class Palavra {
  texto: string;
  tipo: TipoPalavra;

  constructor(texto: string, tipo: TipoPalavra) {
    this.texto = texto;
    this.tipo = tipo;
  }
}
