import { IRoom } from './room';

export interface IUser {
  name: string;
  id: string;
  session_id: string;
  current_room?: IRoom;
  created_at: number;
  disconnected_at?: number;
}
