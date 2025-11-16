import WebSocket from 'ws';

export interface ClientWebSocket extends WebSocket {
  isActive: boolean;
  namePlayer: string;
}

export type SocketMessage = {
  id: number;
  data: string;
  type: string;
};
