import { Palavra } from "./palavra";

export class Jogo {
    id: number;
    palavras : Palavra[];
    constructor(id: number, palavras: Palavra[]) {
        this.id = id
        this.palavras = palavras
    }
}