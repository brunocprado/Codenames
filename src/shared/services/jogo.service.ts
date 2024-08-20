import { Injectable, OnInit } from "@angular/core"
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, Subject } from "rxjs";
import io from 'socket.io-client';
import { TipoJogador } from "../models/tipo-jogador";

@Injectable({providedIn: 'root'})
export class JogoService {

    private IP : string = "brunoprado.ddns.net"
    private socket = io(`http://${this.IP}:3000`);

    public idJogo ?: string;
    public tipoJogador : TipoJogador = TipoJogador.OPERADOR;

    constructor(private http: HttpClient) {}

    getMensagens() {
        return new Observable((subscriber) => {
            this.socket.onAny((evento, ...args) => {
                subscriber.next({ evento, data: args });
            });
        
            return () => {
                this.socket.offAny();
                console.log("Observable desconectado");
            };
        });
    }

    enviaMensagem(tipo: string, msg: any){
        this.socket.emit(tipo, msg);
    }
    

}
