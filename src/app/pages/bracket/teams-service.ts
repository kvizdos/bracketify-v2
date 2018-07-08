import { Injectable } from '@angular/core';
import { bracketService } from './bracket-service';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class TeamService {
  
  messages: Subject<any>;
  
  // Our constructor calls our wsService connect method
  constructor(private wsService: bracketService) {
    this.messages = <Subject<any>>wsService
      .connect();
   }
  
  // Our simplified interface for sending
  // messages back to our socket.io server
  sendMsg(msg) {
    this.messages.next(msg);
  }

}