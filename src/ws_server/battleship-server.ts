import { WebSocketServer } from 'ws';
import { GameAction } from '../models/models';
import { ClientWebSocket, SocketMessage } from '../models/ws.models';
import { usersState } from '../storage/users';
import { Game } from './game';
import { Players } from './players';
import { Room } from './rooms';

export class BattleshipServer {
  private players = new Players();
  private room = new Room();
  private game = new Game();

  constructor(private webSocketServer: WebSocketServer) {}

  cleanSocket(socket: ClientWebSocket) {
    const winnerName = this.game.closeRoom(socket);

    if (winnerName) {
      this.addWinner(winnerName);
      this.updateAllClients();
    }

    socket.isActive = false;
    socket.terminate();
  }


  registerPlayer(socket: ClientWebSocket, message: SocketMessage) {
    this.players.registerPlayer(message, socket);
    this.updateAllClients();
  }

  addShips(message: SocketMessage) {
    this.game.addShips(message.data);
  }

  attack(message: SocketMessage) {
    const winnerUserName = this.game.attack(message.data);

    if (winnerUserName) {
      this.addWinner(winnerUserName);
      this.updateAllClients();
    }
  }

  randomAttack(message: SocketMessage) {
    this.game.attackRandom(message.data);
  }

  singlePlay(socket: ClientWebSocket) {
    this.game.createSinglePlay(socket);
  }

  private addWinner(namePlayer: string) {
    const user = usersState.get(namePlayer);

    if (user) {
      user.wins += 1;
    }
  }

  private updateAllClients() {
    this.room.sendFreeRooms(this.webSocketServer);

    const winners = Array.from(usersState.values())
    .filter((user) => user.wins > 0)
    .map((user) => ({ name: user.name, wins: user.wins }));

    const message = JSON.stringify({
      id: 0,
      type: GameAction.UpdateWinners,
      data: JSON.stringify(winners),
    });

    console.log(GameAction.UpdateWinners, message);
    this.webSocketServer.clients.forEach((client) => client.send(message));
  }

  createRoom(socket: ClientWebSocket) {
    const roomId = this.game.createRoom(socket);

    if (roomId) {
      this.updateAllClients();
    }
  }

  addUserToRoom(socket: ClientWebSocket, message: SocketMessage) {
    const roomId = this.room.addUserToRoom(message.data, socket);

    if (roomId) {
      this.updateAllClients();
      this.game.createGame(roomId);
    }
  }
}
