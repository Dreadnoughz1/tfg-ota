import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService {
  constructor(private socket: Socket) {}

  connect() {
    this.socket = io(environment.wsUrl, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });
  }

  onAlert(cb: (data: any) => void) {
    this.socket.on('alert', cb);
  }
}
