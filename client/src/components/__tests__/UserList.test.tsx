import { render, screen } from '@testing-library/react';
import React from 'react';

import { createTestRoom, createTestUser } from '../../__tests__/testUtils';
import { IUser } from '../../common/user';
import UserList from '../UserList';

const testRoom1 = createTestRoom('Room 1');
const testRoom2 = createTestRoom('Room 2');

const testUserList: IUser[] = [
  createTestUser('Janusz', { online: true, room: testRoom1 }),
  createTestUser('Grazyna', { online: true, room: testRoom1 }),
  createTestUser('Pioter', { online: true, room: testRoom2 }),
  createTestUser('Brajan', { online: false }),
];
const janusz = testUserList[0];

describe('<UserList />', () => {
  it('displays user status list', () => {
    const userList = render(<UserList users={testUserList} currentUser={janusz} />);
    expect(userList).toMatchSnapshot();
  });
  it('displays correct status', () => {
    render(<UserList users={testUserList} currentUser={janusz} />);

    expect(getStatusClassName('Grazyna')).toContain('available');
    expect(getStatusClassName('Pioter')).toContain('away');
    expect(getStatusClassName('Brajan')).toContain('dnd');
  });
});

const getStatusClassName = (username: string) =>
  screen.getByText(username).parentElement?.className;
