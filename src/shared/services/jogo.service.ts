import { Injectable, OnInit } from "@angular/core"
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, Subject } from "rxjs";
import io from 'socket.io-client';

@Injectable({providedIn: 'root'})
export class JogoService {

    private socket = io('http://brunoprado.ddns.net:3000');

    constructor(private http: HttpClient) {}

    getMensagens() {
        return new Observable((subscriber) => {
            // Escuta qualquer evento recebido
            this.socket.onAny((evento, ...args) => {
                subscriber.next({ evento, data: args });
            });
        
            // Limpeza ao se desinscrever
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
