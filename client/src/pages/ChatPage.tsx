import {
  MainContainer,
  ChatContainer,
  MessageList,
  MessageInput,
  Avatar,
  ConversationHeader,
  VoiceCallButton,
  VideoCallButton,
  InfoButton,
  MessageSeparator,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useAuth } from '../common/auth';
import { groupAvatarUrl2 } from '../common/avatars';
import { IMessage } from '../common/message';
import { IRoom } from '../common/room';
import { ChatSocketManager } from '../common/socket';
import ConversationSidebar from '../components/ConversationSidebar';
import { renderMessages } from '../components/Messages';
import RightSidebar from '../components/RightSidebar';

export default function ChatPage() {
  const [sid, setSid] = useState<string | null>(null);
  const [socket, setSocket] = useState<ChatSocketManager | undefined>();
  const [messages, setMessages] = useState<IMessage[]>([]);
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
    manager.onChatMessageHandlers.addListener(msg => {
      setMessages(oldMsgs => [...oldMsgs, msg]);
    });
    // server has assigned the user to a room
    manager.onRoomChangedHandlers.addListener(room => {
      setRoom(room);
      setMessages([]);
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

  //
  const sendMessage = (text: string) => {
    socket?.sendMessage({ content: text });
  };

  // user has clicked a room on left sidebar
  const requestRoomChange = (newRoom: IRoom) => {
    if (room.id === newRoom.id) {
      return;
    }
    socket?.switchRoom(newRoom.id);
  };

  const RenderHeader = ({ room: { name, description }, as: _as }: { room: IRoom; as: any }) => (
    <ConversationHeader>
      <ConversationHeader.Back />
      <Avatar src={groupAvatarUrl2(name)} name={name} />
      <ConversationHeader.Content userName={name} info={description} />
      <ConversationHeader.Actions>
        <VoiceCallButton disabled />
        <VideoCallButton disabled />
        <InfoButton />
      </ConversationHeader.Actions>
    </ConversationHeader>
  );

  return (
    <div
      style={{
        height: '100%',
        position: 'relative',
      }}>
      <MainContainer responsive>
        <ConversationSidebar activeRoomChanged={requestRoomChange} activeRoomId={room.id} />
        <ChatContainer>
          <RenderHeader room={room} as={ConversationHeader} />
          <MessageList>
            <MessageSeparator content="Your conversation starts here." />
            {renderMessages(messages, auth?.user)}
          </MessageList>
          <MessageInput placeholder="Type message here" onSend={sendMessage} />
        </ChatContainer>
        <RightSidebar auth={auth} sid={sid ?? undefined} />
      </MainContainer>
    </div>
  );
}
