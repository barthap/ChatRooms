import { Status, StatusList } from '@chatscope/chat-ui-kit-react';
import React from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { IUser } from '../common/user';

type UserStatus = 'available' | 'eager' | 'dnd' | 'unavailable' | 'invisible' | 'away';

function getStatusText(status: UserStatus, roomName?: string) {
  switch (status) {
    case 'available':
      return 'In your room';
    case 'dnd':
      return 'Offline';
    case 'invisible':
      return 'Outside any room';
    case 'away':
      return `In room: ${roomName}`;
    default:
      // this should never happen
      return 'Unknown status';
  }
}

function renderUser(user: IUser, currentUser?: IUser) {
  const currentRoom = currentUser?.current_room;
  const isOffline = user.session_id == null;
  const isCurrentRoom = user.current_room?.id === currentRoom?.id;
  const isSelected = user.id === currentUser?.id;

  const status: UserStatus = isOffline
    ? 'dnd'
    : currentRoom == null
    ? 'invisible'
    : isCurrentRoom
    ? 'available'
    : 'away';

  const statusText = isSelected ? 'You' : getStatusText(status, user.current_room?.name);

  return (
    <OverlayTrigger
      // @ts-expect-error
      as={Status}
      key={user.id}
      placement="left"
      overlay={<Tooltip id={`tooltip-${user.id}`}>{statusText}</Tooltip>}>
      <Status key={user.id} status={status} name={user.name} selected={isSelected} />
    </OverlayTrigger>
  );
}

export default function UserList({ users, currentUser }: { users: IUser[]; currentUser?: IUser }) {
  const renderUserForCurrent = (user: IUser) => renderUser(user, currentUser);
  return (
    <StatusList size="md" style={{ padding: 0 }}>
      {users.map(renderUserForCurrent)}
    </StatusList>
  );
}
