import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { config } from "../../../assets/config.js"
@Injectable()
export class BracketService {
    socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io.connect("http://" + config.urls.socket);
    }

    on(eventName: any, callback: any) {
        if(this.socket) {
            this.socket.on(eventName, function(data: any) {
                callback(data);    
            });
        }
    }

    newTeam(teams: any, id: any, modid: any) {
        if(this.socket) {
            console.log(teams.toString() + " - " + id + " - " + modid);
            this.socket.emit('teamsync', {teams: teams, id: id, modid: modid});
        }
    }

    emit(eventName: any, data: any) {
        if(this.socket) {
            this.socket.emit(eventName, data);
        }
    }

    removeListener(eventName: any) {
        if(this.socket) {
            this.socket.removeListener(eventName);
        }
    }
}