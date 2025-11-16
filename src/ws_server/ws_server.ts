import WebSocket, { WebSocketServer } from 'ws';
import { httpServer } from '../http_server';
import { GameAction } from '../models/models';
import { ClientWebSocket, SocketMessage } from '../models/ws.models';
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
  .on('message', (rawMessage: WebSocket.RawData) => {
    const message: SocketMessage = JSON.parse(rawMessage.toString());

    switch (message.type) {
      case GameAction.Registration: {
        server.registerPlayer(socket, message);
        break;
      }

      case GameAction.AddShips: {
        server.addShips(message);
        break;
      }

      case GameAction.Attack: {
        server.attack(message);
        break;
      }

      case GameAction.RandomAttack: {
        server.randomAttack(message);
        break;
      }

      case GameAction.SinglePlay: {
        server.singlePlay(socket);
        break;
      }

      case GameAction.CreateRoom: {
        server.createRoom(socket);
        break;
      }

      case GameAction.AddUserToRoom: {
        server.addUserToRoom(socket, message);
        break;
      }
    }

  })
  .on('close', () => server.cleanSocket(socket))
  .on('error', console.error);
});
