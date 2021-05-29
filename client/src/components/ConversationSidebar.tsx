import { Sidebar, ConversationList, Conversation, Avatar } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';

import { groupAvatarUrl2 } from '../common/avatars';
import { API_URL } from '../common/constants';
import { createRoom, IRoom } from '../common/room';
import { ChatSocketManager } from '../common/socket';
import { useAsync } from '../common/utils';
import AddRoomModal, { AddRoomCallback } from './AddRoomModal';

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
  as?: unknown;
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
  socket,
}: {
  activeRoomId: string;
  activeRoomChanged?: (room: IRoom) => void;
  socket?: ChatSocketManager;
}) {
  const [rooms, setRooms] = useState<IRoom[]>([]);

  const changeActiveRoom = (room: IRoom) => {
    activeRoomChanged?.(room);
  };

  const addRoom: AddRoomCallback = async (roomData, setError, closeModal) => {
    try {
      const room = await createRoom(roomData);
      closeModal();
      changeActiveRoom(room);
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Unknown error, please see console');
      }
    }
  };

  // listen for room list change from server
  useEffect(() => {
    const listener = socket?.onRoomListChangedHandlers.addListener(setRooms);
    return () => {
      listener && socket?.onRoomListChangedHandlers.removeListener(listener);
    };
  }, [socket]);

  // initial load room list using HTTP /rooms API
  useAsync(loadRooms, rooms => {
    setRooms(rooms);
  });

  console.count('Sidebar Render');

  return (
    <Sidebar position="left" scrollable={false}>
      <AddRoomModal onAddRoom={addRoom} />

      <ConversationList loading={rooms.length === 0}>
        {rooms.map(room => (
          <RoomListItem
            as={Conversation}
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
