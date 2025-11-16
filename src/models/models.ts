import { ClientWebSocket } from './ws.models';

export type PlayerInfo = {
  id?: number;
  socket?: ClientWebSocket;
  ships?: ShipInfo[];
  game?: { shipIndex: number; isAttacked: boolean }[][];
  isBot: boolean;
};

export type UserInfo = {
  id?: number;
  name: string;
  password: string;
  socket: ClientWebSocket;
  wins: number;
};

export type RoomInfo = {
  idRoom: number;
  idPlayerCurrent: number;
  namePlayer: string;
  players: PlayerInfo[];
};

export type ShipInfo = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
  hp?: number;
};

export enum GameAction {
  Registration = 'reg',
  CreateRoom = 'create_room',
  AddUserToRoom = 'add_user_to_room',
  UpdateRoom = 'update_room',
  AddShips = 'add_ships',
  Attack = 'attack',
  RandomAttack = 'randomAttack',
  SinglePlay = 'single_play',
  UpdateWinners = 'update_winners',
  CreateGame = 'create_game',
  StartGame = 'start_game',
  Finish = 'finish',
  Turn = 'turn',
  Killed = 'killed',
  Shot = 'shot',
  Miss = 'miss',
}

export type Cell = {
  shipIndex: number;
  isAttacked: boolean;
};
