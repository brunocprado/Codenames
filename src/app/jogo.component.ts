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
  providers: [
    JogoService
  ],
  templateUrl: './jogo.component.html',
  styleUrl: './jogo.component.css'
})
export class AppComponent implements OnInit {
  
  constructor(private jogoService : JogoService, private http: HttpClient, private rota:ActivatedRoute) {}

  public id : string = "0";
  public jogo : Jogo = new Jogo(0,[]);
  public time : number = 0;
  public timeJogando : number = 0;
  @Input() idJogo!: string;
  
  public tipoJogador : TipoJogador = TipoJogador.ESPIAO;
  
  //espiao
  public inputPalavra : string = "";
  public numeroPalavras : number = 1;
  public jaEnviou : boolean = false;

  public historico : string = '';

  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    
    console.log(this.idJogo, this.route.snapshot.paramMap.get('id'))
    this.jogoService.getMensagens().subscribe({
      next: (r : any) => {
          console.log(r)
          if(r.evento == 'selecionou'){
            this.historico += `Time: ${this.time} selecionou a palavra ${r.data[0].texto} \n`
            for(var p in this.jogo.palavras){
                if(this.jogo.palavras[p].texto == r.data[0].texto) this.jogo.palavras[p] = r.data[0];
            }
            if(!r.data[1]) { 
              (this.timeJogando == 0) ? this.timeJogando = 1 : this.timeJogando = 0;
              if(this.time == this.timeJogando && this.tipoJogador == TipoJogador.ESPIAO){
                this.jaEnviou = false;                
              }
              console.log("MUDOU O TIME", this.time);
            }
            if(r.data[0].tipo == TipoPalavra.PRETA) {
              //ACABOU O JOGO
              this.time = 2;
            }
          }

          if (r.evento == 'dica'){
            this.historico += `Time: ${this.time} deu a dica ${r.data[0].texto} \n`
          }
      },
      error: (e) => console.error('erro:', e),
      complete: () => console.log('completo'),
    });
  }

  novoJogo() : void {
    this.http.get<Jogo>("http://brunoprado.ddns.net:3000/novo-jogo/" + this.id).subscribe((r) => {
      console.log(r)
      this.jogo = r;
    });
    
  }

  conectar() : void {
    this.http.get<Jogo>("http://brunoprado.ddns.net:3000/jogo/0/" + this.tipoJogador).subscribe((r) => {
      console.log(r)
      this.jogo = r;
    });
  }

  selecionaPalavra(palavra: Palavra) {
    if(palavra.tipo != TipoPalavra.NAO_REVELADA || this.tipoJogador == TipoJogador.ESPIAO) return;
    this.jogoService.enviaMensagem('escolha', {texto: palavra.texto, time: this.time })
  }

  enviaPalavra() : void {
    this.jogoService.enviaMensagem('dica', {texto: this.inputPalavra, n: this.numeroPalavras, time: this.time })
    this.jaEnviou = true;
  }
  
}
