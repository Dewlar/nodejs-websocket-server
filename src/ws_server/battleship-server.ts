import { WebSocketServer } from 'ws';
import { GameAction } from '../models/models';
import { ClientWebSocket, SocketMessage } from '../models/ws.models';
import { Players } from './players';

export class BattleshipServer {
  players = new Players();

  constructor(private webSocketServer: WebSocketServer) {}

  cleanSocket(socket: ClientWebSocket) {
    socket.isActive = false;
    socket.terminate();
  }


  registerWebSocket(ws: ClientWebSocket, message: SocketMessage) {
    this.players.registerPlayer(message, ws);
    this.sendUpdate();
  }

  addShipsWebSocket(message: SocketMessage) {
    this.game.addShips(message.data);
  }

  attackWebSocket(message: SocketMessage) {
    const winnerUserName = this.game.attack(message.data);

    if (winnerUserName) {
      this.addWinner(winnerUserName);
      this.sendUpdate();
    }
  }

  randomAttackWebSocket(message: SocketMessage) {
    this.game.attackRandom(message.data);
  }

  singlePlayWebSocket(ws: ClientWebSocket) {
    this.game.createSinglePlay(ws);
  }

  private addWinner(namePlayer: string) {
    const user = usersAll.get(namePlayer);

    if (user) {
      user.wins += 1;
    }
  }

  private sendUpdate() {
    const winners = Array.from(usersAll.values())
    .filter((user) => user.wins > 0)
    .map((user) => ({ name: user.name, wins: user.wins }));

    const message = JSON.stringify({
      id: 0,
      type: GameAction.UpdateWinners,
      data: JSON.stringify(winners),
    });

    this.webSocketServer.clients.forEach((client) => client.send(message));
  }
}
