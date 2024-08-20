import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { JogoService } from '../shared/services/jogo.service';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterOutlet, MenuComponent],
  providers: [
    JogoService
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private jogoService = inject(JogoService);

  constructor() {}

}
