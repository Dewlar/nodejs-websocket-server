import WebSocket, { WebSocketServer } from 'ws';
import { httpServer } from '../http_server';
import { ClientWebSocket } from '../models/ws.models';
import { BattleshipServer } from './battleship-server';

export const webSocketServer = new WebSocketServer({ server: httpServer });

const server = new BattleshipServer(webSocketServer);

const intervalSessions = setInterval(() => {
  webSocketServer.clients.forEach((client) => {
    const ws = client as ClientWebSocket;

    if (!ws.isActive) {
      ws.terminate();
      return;
    }

    ws.isActive = false;
    ws.ping();
  });
}, 10000);

process.on('SIGINT', () => {
  clearInterval(intervalSessions);

  webSocketServer.clients.forEach((client) => {
    if (client.readyState !== WebSocket.OPEN) return;
    client.close();
  });

  webSocketServer.close();
  httpServer.close();

  process.exit();
});

webSocketServer.on('connection', (socket: ClientWebSocket, req) => {
  socket.isActive = true;

  console.log('New WebSocket connected, with key: ', req.headers['sec-websocket-key']);

  socket
  .on('pong', () => (socket.isActive = true))
  .on('message', () => {})
  .on('close', () => server.cleanSocket(socket))
  .on('error', console.error);
});
