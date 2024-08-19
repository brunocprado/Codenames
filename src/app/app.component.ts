import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JogoService } from '../shared/services/jogo.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Palavra, TipoPalavra } from '../shared/models/palavra';
import { Jogo } from '../shared/models/jogo';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterOutlet],
  providers: [
    JogoService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  constructor(private jogoService : JogoService, private http: HttpClient) {}

  public id : string = "";
  public jogo : Jogo = new Jogo(0,[],[],[]);
  public time : number = 0;

  ngOnInit(): void {
    this.http.get<Jogo>("http://localhost:3000/jogo/0").subscribe((r) => {
      console.log(r)
      this.jogo = r;
    });
    this.jogoService.getMensagens().subscribe({
      next: (r : any) => {
          console.log(r)
          if(r.evento == 'selecionou'){
            for(var p in this.jogo.palavras){
                if(this.jogo.palavras[p].texto == r.data[0].texto) this.jogo.palavras[p] = r.data[0];
            }
            if(!r.data[1]) console.log("TODO:MUDAR O TIME")
          }
      },
      error: (err) => console.error('Erro no Observable:', err),
      complete: () => console.log('Observable completo'),
    });
  }

  conectar() : void {
    if(this.id) {
      this.http.get<Jogo>("http://localhost:3000/jogo/" + this.id).subscribe((r) => {
        console.log(r)
        this.jogo = r;
      });
    } else {
      this.http.get<Jogo>("http://localhost:3000/novo-jogo").subscribe((r) => {
        console.log(r)
        this.jogo = r;
      });
    }
  }

  teste() : void {
    //this.jogoService.enviaMsg("isso é um teste")
  }

  selecionaPalavra(palavra: Palavra) {
    if(palavra.tipo != TipoPalavra.NAO_REVELADA) return;
    this.jogoService.enviaMensagem('escolha', {texto: palavra.texto, time: this.time })
  }
  
}
