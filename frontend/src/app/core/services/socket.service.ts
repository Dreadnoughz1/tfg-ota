import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;

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
