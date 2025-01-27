import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$!: WebSocketSubject<any>;

  constructor() {}

  // Initialize WebSocket connection with a dynamic API path
  connect(apiPath: string): void {
    this.socket$ = webSocket(`ws://backend.staybook.pk/public/api/${apiPath}`);
  }

  // Listen to WebSocket messages
  onMessage(): Observable<any> {
    return this.socket$.asObservable();
  }

  // Send a message to the WebSocket server
  sendMessage(msg: any): void {
    this.socket$.next(msg);
  }

  // Close the WebSocket connection
  close(): void {
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}
