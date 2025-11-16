import { ClientWebSocket, SocketMessage } from '../models/ws.models';
import { usersState } from '../storage/users';

export class Players {
  count = 1;

  registerPlayer({ data, type }: SocketMessage, socket: ClientWebSocket) {
    const userData = JSON.parse(data);
    const { name, password } = userData;
    const user = usersState.get(name);

    if (!user) {
      const idUser = this.count++;

      usersState.set(name, { ...userData, socket, wins: 0, idUser });

      socket.namePlayer = name;

      this.sendMessage(socket, type, {
        name,
        idUser,
        error: false,
        errorText: '',
      });
    } else {
      if (user.socket.isActive) {
        return this.sendMessage(socket, type, {
          name,
          id: -1,
          error: true,
          errorText: 'This name is exists',
        });
      }

      if (user.password !== password) {
        return this.sendMessage(socket, type, {
          name,
          id: -1,
          error: true,
          errorText: 'Password is incorrect',
        });
      }

      socket.namePlayer = name;
      user.socket = socket;

      this.sendMessage(socket, type, {
        name,
        id: user.id,
        error: false,
        errorText: '',
      });
    }
  }

  private sendMessage(socket: ClientWebSocket, type: string, data: any) {
    const message = JSON.stringify({ type, data: JSON.stringify(data), id: 0 });
    socket.send(message);
    console.log('sendMessage: ', message);
  }
}
