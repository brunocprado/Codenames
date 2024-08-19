import { Routes } from '@angular/router';
import { JogoComponent } from './jogo/jogo.component';

export const routes: Routes = [
    { path: ':id', component: JogoComponent }
];
