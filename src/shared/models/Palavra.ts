export enum TipoPalavra {
  VERMELHA = "vermelha", AZUL = "azul", BRANCA = "branca", PRETA = "preta"
}
export class Palavra {
  texto: string;
  tipo: TipoPalavra;
  revelada: boolean = false;

  constructor(texto: string, tipo: TipoPalavra) {
    this.texto = texto;
    this.tipo = tipo;
  }
}
