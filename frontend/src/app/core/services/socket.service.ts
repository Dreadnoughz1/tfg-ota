import { Injectable } from '@angular/core';
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
