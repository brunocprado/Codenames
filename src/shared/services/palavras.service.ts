import { Injectable, OnInit } from "@angular/core"
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, Subject } from "rxjs";

const PALAVRAS = 
`livro
caneta
garfo
panela
mesa
cama
microfone
celular
martelo
bolsa
criança
menina
garoto
pai
mãe
homem
mulher
professor
médica
estudante
ator	
empresário
cachorro
gato
cavalo
tigre
papagaio
mico
capivara
palmeira
roseira
samambaia
capim
coqueiro
girassol
goiaba
banana
pitanga
laranja
limão
mamão
montanha	
ilha
lago
rio
mangue
serra
bairro
cidade
país
manhã
noite
dia
sol
chuva
vento
mês
século
fada
fantasma
bruxa
sereia
vampiro
flor
roupa
água
canela
planeta
recado
vida
papelaria
drogaria
povo
colega
jardineiro
telefonista
águia	
boto
peixinho
manga
ovo
passeio
fome
calor
frio
casinha
cartão
cadeira
cortina
rádio
pente
caderno
borracha
janela
tijolo
telha
relógio
garrafa
jacaré
golfinho
serpente
rinoceronte
hipopótamo
formiga	
galinha
jaca
pitanga
laranja
melancia
maçã
maracujá
caqui
samambaia
capim
ipê
margarida
cacto
chuva
vento
trovoada
neve	
noite
homem
mulher
professora
dentista
porteiro
psicóloga
advogado
praia
jardim
feira
cinema
bruxa
duende
unicórnio
lobisomem`

@Injectable({providedIn: 'root'})
export class PalavrasService {

    constructor(private http: HttpClient) {}

    public listaPalavras : string[] = [];

    public geraPalavras() : void {
        console.log("AAA")
        //if(this.listaPalavras.length > 0) return;
        
        this.listaPalavras = this.getRandomWords(PALAVRAS.split('\n'), 20);

        // this.http.get('http://localhost:8000/base.txt', { responseType: 'text' }).subscribe((r) => {
        //   console.log(r);
        // })
    }

    private getRandomWords(words: string[], count: number): string[] {
        const shuffled = words.sort(() => 0.5 - Math.random());
        console.log(shuffled.slice(0, count))
        return shuffled.slice(0, count);
      }

}
