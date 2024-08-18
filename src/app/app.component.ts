import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PalavrasService } from '../shared/services/palavras.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Palavra } from '../shared/models/palavra';
import { Jogo } from '../shared/models/jogo';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterOutlet],
  providers: [
    PalavrasService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  constructor(private palavras : PalavrasService, private http: HttpClient) {}

  public id : string = "";
  public jogo ?: Jogo;

  ngOnInit(): void {
    this.http.get<Jogo>("http://localhost:3000/jogo/0").subscribe((r) => {
      console.log(r)
      this.jogo = r;
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

  selecionaPalavra(palavra: Palavra) {
    palavra.revelada = true;
  }
  
}
