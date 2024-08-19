export enum TipoPalavra {
  VERMELHA = "vermelha", AZUL = "azul", BRANCA = "branca", PRETA = "preta", NAO_REVELADA = "nao_revelada"
}
export class Palavra {
  texto: string;
  tipo: TipoPalavra;

  constructor(texto: string, tipo: TipoPalavra) {
    this.texto = texto;
    this.tipo = tipo;
  }
}
