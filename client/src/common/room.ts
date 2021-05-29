export interface IRoom {
  id: string;
  name: string;
  description: string;
}

export type NewRoom = Pick<IRoom, 'name' | 'description'>;
