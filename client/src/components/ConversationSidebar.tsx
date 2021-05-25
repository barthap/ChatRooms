import {
  Sidebar,
  Button,
  ConversationList,
  Conversation,
  Avatar,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

import { groupAvatarUrl2 } from '../common/avatars';
import { API_URL } from '../common/constants';
import { IRoom } from '../common/room';
import { useAsync } from '../common/utils';

async function loadRooms(): Promise<IRoom[]> {
  try {
    const result = await fetch(API_URL + '/rooms/');
    return await result.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

interface ItemProps {
  room: IRoom;
  isActive: boolean;
  onClick?: (room: IRoom) => void;
}

const RoomListItem = ({ room, isActive, onClick }: ItemProps) => (
  <Conversation
    name={room.name}
    info={room.description}
    active={isActive}
    onClick={() => onClick?.(room)}>
    <Avatar src={groupAvatarUrl2(room.name)} name={room.name} status="available" />
  </Conversation>
);

export default function ConversationSidebar({
  activeRoomId,
  activeRoomChanged,
}: {
  activeRoomId: string;
  activeRoomChanged?: (room: IRoom) => void;
}) {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  //const [activeRoomId, setActiveRoomId] = useState('_default');

  const changeActiveRoom = (room: IRoom) => {
    //setActiveRoomId(room.id);
    activeRoomChanged?.(room);
  };

  console.count('Sidebar Render');
  useAsync(loadRooms, rooms => {
    setRooms(rooms);

    //const defaultRoom = rooms.find(room => room.id === activeRoomId);
    //defaultRoom && activeRoomChanged?.(defaultRoom);
  });

  return (
    <Sidebar position="left" scrollable={false}>
      <Button border icon={<FontAwesomeIcon icon={faPlus} />} className="mt-3 mb-3">
        Create new room
      </Button>

      <ConversationList loading={rooms.length === 0}>
        {rooms.map(room => (
          <RoomListItem
            key={room.id}
            room={room}
            isActive={room.id === activeRoomId}
            onClick={changeActiveRoom}
          />
        ))}
      </ConversationList>
    </Sidebar>
  );
}

/* A few examples
 
       <Conversation name="Lilly" lastSenderName="Lilly" info="Yes i can do it for you">
          <Avatar src={groupAvatarUrl2('Lilly')} name="Lilly" status="available" />
        </Conversation>

        <Conversation name="Joe" lastSenderName="Joe" info="Yes i can do it for you">
          <Avatar src={groupAvatarUrl2('Joe')} name="Joe" status="dnd" />
        </Conversation>

        <Conversation
          name="Emily"
          lastSenderName="Emily"
          info="Yes i can do it for you"
          unreadCnt={3}>
          <Avatar src={groupAvatarUrl2('Emily')} name="Emily" status="available" />
        </Conversation>

        <Conversation name="Kai" lastSenderName="Kai" info="Yes i can do it for you" unreadDot>
          <Avatar src={groupAvatarUrl2('Kai')} name="Kai" status="unavailable" />
        </Conversation>

        <Conversation name="Akane" lastSenderName="Akane" info="Yes i can do it for you">
          <Avatar src={groupAvatarUrl2('Akane')} name="Akane" status="eager" />
        </Conversation>

        <Conversation name="Eliot" lastSenderName="Eliot" info="Yes i can do it for you">
          <Avatar src={groupAvatarUrl2('Eliot')} name="Eliot" status="away" />
        </Conversation>

        <Conversation name="Zoe" lastSenderName="Zoe" info="Yes i can do it for you" active>
          <Avatar src={groupAvatarUrl2('Zoe')} name="Zoe" status="dnd" />
        </Conversation>

        <Conversation name="Patrik" lastSenderName="Patrik" info="Yes i can do it for you">
          <Avatar src={groupAvatarUrl2('Patrik')} name="Patrik" status="invisible" />
        </Conversation>

*/
