import { WebSocketServer } from 'ws';
import { GameAction } from '../models/models';
import { ClientWebSocket } from '../models/ws.models';
import { roomsState } from '../storage/rooms';

export class Room {
  sendFreeRooms(webSocketServer: WebSocketServer) {
    const freeRooms = Array.from(roomsState.entries())
    .filter(([, Room]) => Room.players.length === 1)
    .map(([id, Room]) => ({
      roomId: id,
      roomUsers: Room.players.map((player) => ({
        name: player.socket?.namePlayer,
        index: player.id,
      })),
    }));

    const message = JSON.stringify({
      id: 0,
      type: GameAction.UpdateRoom,
      data: JSON.stringify(freeRooms),
    });

    webSocketServer.clients.forEach((client) => client.send(message));
  }

  addUserToRoom(dataString: string, socket: ClientWebSocket) {
    const { indexRoom } = JSON.parse(dataString);
    const Room = roomsState.get(indexRoom);

    if (!Room) return;

    const players = Room.players;

    if (players.length !== 1 || Room.namePlayer === socket.namePlayer) return;

    const firstPlayer = players[0];

    if (firstPlayer) {
      roomsState.set(indexRoom, {
        ...Room,
        players: [firstPlayer, { socket, id: 1, isBot: false }],
      });
    }

    return indexRoom;
  }
}
