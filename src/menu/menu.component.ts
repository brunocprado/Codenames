import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { JogoService } from '../shared/services/jogo.service';
import { HttpClient } from '@angular/common/http';
import { TipoJogador } from '../shared/models/tipo-jogador';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterOutlet],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent{

  private jogoService = inject(JogoService);

  public tipoJogador : TipoJogador = TipoJogador.ESPIAO;
  public id ?: string = "";
  public time : number = 0

  constructor(private http: HttpClient, private rota: Router) { }

  novoJogo() : void {
    this.http.post<string>("http://brunoprado.ddns.net:3000/novo-jogo", {prompt: this.id, nPalavras: 25}).subscribe((r) => {
      console.log("Jogo criado", r)
      this.jogoService.idJogo = r.toString();
      this.jogoService.tipoJogador = this.tipoJogador;
      this.jogoService.time = this.time;
      this.rota.navigate([r, { }]);
    });
    
  }

  conectar() : void {
    this.jogoService.tipoJogador = this.tipoJogador;
    this.jogoService.time = this.time;
    this.rota.navigate([this.id, {  }]);
  }

}
