import { IRoom } from '../common/room';
import { IUser } from '../common/user';

export function createTestUser(
  name: string,
  { online, room }: { online: boolean; room?: IRoom }
): IUser {
  return {
    id: name,
    name,
    session_id: online ? name : undefined,
    created_at: 0,
    current_room: room,
  };
}

export function createTestRoom(name: string): IRoom {
  return {
    id: name,
    name,
    description: '',
  };
}
