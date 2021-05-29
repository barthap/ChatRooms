import { API_URL } from './constants';

export interface IRoom {
  id: string;
  name: string;
  description: string;
}

export type NewRoom = Pick<IRoom, 'name' | 'description'>;

/**
 * Requests server to create a room
 * @param room Created room details
 * @returns A promise resolving to created room
 */
export async function createRoom(room: NewRoom): Promise<IRoom> {
  const response = await fetch(`${API_URL}/rooms/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(room),
  });

  const body = await response.json();
  if (response.status === 201) {
    return body;
  }
  throw new Error(body.message ?? 'unknown error: ' + JSON.stringify(body));
}
