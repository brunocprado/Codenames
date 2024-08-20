import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { JogoService } from '../shared/services/jogo.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Palavra, TipoPalavra } from '../shared/models/palavra';
import { Jogo } from '../shared/models/jogo';
import { FormsModule } from '@angular/forms';
import { TipoJogador } from '../shared/models/tipo-jogador';

@Component({
  selector: 'jogo',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterOutlet],
  templateUrl: './jogo.component.html',
  styleUrl: './jogo.component.css'
})
export class JogoComponent implements OnInit {

  private jogoService = inject(JogoService);
  
  constructor(private http: HttpClient, private rota:ActivatedRoute) {}

  public jogo : Jogo = new Jogo(0,[]);
  public time : number = 0;
  public timeJogando : number = 0;
  
  public tipoJogador : TipoJogador = TipoJogador.OPERADOR;
  
  //ESPIAO
  public inputPalavra : string = "";
  public numeroPalavras : number = 1;
  public jaEnviou : boolean = false;

  public historico : string = '';

  ngOnInit(): void {    
    this.jogoService.idJogo = this.rota.snapshot.paramMap.get('idJogo')!;
    this.tipoJogador = this.jogoService.tipoJogador;
    // this.tipoJogador = this.rota.snapshot.paramMap.get('tipoJogador')! as TipoJogador;
    console.log({id: this.jogoService.idJogo, tipoJogador: this.tipoJogador})

    this.http.post<Jogo>('http://brunoprado.ddns.net:3000/jogo', {id: this.jogoService.idJogo, tipoJogador: this.tipoJogador}).subscribe((r) => {
      console.log("conectado no jogo", r)
      this.jogo = r;
      this.jogoService.enviaMensagem('entra-sala', this.jogoService.idJogo)
    });

    this.jogoService.getMensagens().subscribe({
      next: (r : any) => {
          console.log(r)
          if(r.evento == 'selecionou'){
            this.historico += `Time: ${this.getTime(this.time)} selecionou a palavra ${r.data[0].texto} \n`
            for(var p in this.jogo.palavras){
                if(this.jogo.palavras[p].texto == r.data[0].texto) this.jogo.palavras[p] = r.data[0];
            }
            if(!r.data[1]) { 
              (this.timeJogando == 0) ? this.timeJogando = 1 : this.timeJogando = 0;
              if(this.time == this.timeJogando){ //&& this.tipoJogador == TipoJogador.ESPIAO
                this.jaEnviou = false;                
              }
              console.log("MUDOU O TIME", this.time);
            }
            if(r.data[0].tipo == TipoPalavra.PRETA) {
              //ACABOU O JOGO
              this.timeJogando = 2;
            }
          }

          if (r.evento == 'dica'){
            this.historico += `Time: ${this.getTime(r.data)} deu a dica ${r.data[0].texto} - ${r.data[0].n} \n`
          }
      },
      error: (e) => console.error('erro:', e),
      complete: () => console.log('completo'),
    });
  }

  selecionaPalavra(palavra: Palavra) {
    if(palavra.tipo != TipoPalavra.NAO_REVELADA || this.tipoJogador == TipoJogador.ESPIAO || !this.jaEnviou) return;
    this.jogoService.enviaMensagem('escolha', {texto: palavra.texto, time: this.time, idJogo: this.jogoService.idJogo })
  }

  enviaPalavra() : void {
    this.jogoService.enviaMensagem('dica', {texto: this.inputPalavra, n: this.numeroPalavras, time: this.time, idJogo: this.jogoService.idJogo })
    this.jaEnviou = true;
  }

  getTime(id : number) : string {
    return ['VERMELHO', 'AZUL'][id];
  }
  
}
