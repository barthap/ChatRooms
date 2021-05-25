import { MainContainer } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useAuth } from '../common/auth';
import { IRoom } from '../common/room';
import { ChatSocketManager } from '../common/socket';
import ConversationContainer from '../components/ConversationContainer';
import ConversationSidebar from '../components/ConversationSidebar';
import RightSidebar from '../components/RightSidebar';

export default function ChatPage() {
  const [sid, setSid] = useState<string | null>(null);
  const [socket, setSocket] = useState<ChatSocketManager | undefined>();
  const [room, setRoom] = useState<IRoom>({ id: '_none', name: 'Loading...', description: '' });

  console.count('Render');

  const auth = useAuth();
  const history = useHistory();

  React.useEffect(() => {
    console.countReset('Render');

    const manager = new ChatSocketManager({
      authUser: auth?.user,
    });

    manager.onConnectHandlers.addListener(sid => {
      setSid(sid);
    });
    manager.onConnectionErrorHandlers.addListener(err => {
      if (err.message === 'invalid_user_id') {
        console.warn('User ID is invalid, redirecting to login');
        auth?.invalidateSession();
        history.push('/login');
      } else {
        console.warn(err);
      }
    });
    // a new message has arrived
    manager.onChatMessageHandlers.addListener(msg => {});
    // server has assigned the user to a room
    manager.onCurrentRoomChangedHandlers.addListener(room => {
      setRoom(room);
    });

    manager.connect();
    setSocket(manager);

    return () => {
      manager.disconnect();
      manager.clearAllEventHandlers();
      setSocket(undefined);
      console.log('Removed manager instance');
    };
  }, []);

  // user has clicked a room on left sidebar
  const requestRoomChange = (newRoom: IRoom) => {
    if (room.id === newRoom.id) {
      return;
    }
    socket?.switchRoom(newRoom.id);
  };

  return (
    <div
      style={{
        height: '100%',
        position: 'relative',
      }}>
      <MainContainer responsive>
        <ConversationSidebar
          activeRoomChanged={requestRoomChange}
          activeRoomId={room.id}
          socket={socket}
        />
        <ConversationContainer auth={auth} socket={socket} room={room} />
        <RightSidebar auth={auth} sid={sid ?? undefined} />
      </MainContainer>
    </div>
  );
}
