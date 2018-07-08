import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import * as rx from 'rxjs';
import * as Rx from 'rxjs/Rx';

@Injectable()
export class bracketService {

  // Our socket connection
  private socket;

  constructor() { }

  connect(): rx.Subject<MessageEvent> {
    this.socket = io('http://localhost:3030');

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    let observable = new rx.Observable(observer => {
        this.socket.on('message', (data) => {
          console.log("Received message from Websocket Server")
          observer.next(data);
        })
        return () => {
          this.socket.disconnect();
        }
    });
    
    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    let observer = {
        next: (data: Object) => {
            this.socket.emit('message', JSON.stringify(data));
        },
    };

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return rx.Subject.create(observer, observable);
  }

}