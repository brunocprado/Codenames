import { Palavra } from "./Palavra";

export class Jogo {
    id: number;
    palavras : Palavra[];
    j1 : string[];
    j2 : string[];
    constructor(id: number, palavras: Palavra[], j1: string[], j2: string[]) {
        this.id = id
        this.palavras = palavras
        this.j1 = j1
        this.j2 = j2
    }
}