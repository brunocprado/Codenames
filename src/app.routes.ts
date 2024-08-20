import { Routes } from '@angular/router';
import { JogoComponent } from './jogo/jogo.component';
import { MenuComponent } from './menu/menu.component';

export const routes: Routes = [
    { path: '', component: MenuComponent },
    { path: ':idJogo', component: JogoComponent } ///:tipoJogador
];
