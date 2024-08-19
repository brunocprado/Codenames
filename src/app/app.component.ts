import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { JogoService } from '../shared/services/jogo.service';
import { TipoJogador } from '../shared/models/tipo-jogador';
import { HttpClient } from '@angular/common/http';
import { Jogo } from '../shared/models/jogo';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterOutlet],
  providers: [
    JogoService
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public tipoJogador : TipoJogador = TipoJogador.ESPIAO;

  public id ?: string = "";
  jogo : Jogo = new Jogo(0,[])

  constructor(private jogoService : JogoService, private http: HttpClient) {}

  novoJogo() : void {
    this.http.get<Jogo>("http://brunoprado.ddns.net:3000/novo-jogo/").subscribe((r) => {
      console.log(r)
      this.jogo = r;
    });
    
  }

  conectar() : void {
    
  }

}
