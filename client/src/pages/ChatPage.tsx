import {
  MainContainer,
  ChatContainer,
  MessageList,
  MessageInput,
  Sidebar,
  Avatar,
  ConversationHeader,
  VoiceCallButton,
  VideoCallButton,
  InfoButton,
  ExpansionPanel,
  TypingIndicator,
  MessageSeparator,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useAuth } from '../common/auth';
import { groupAvatarUrl2 } from '../common/avatars';
import { IMessage } from '../common/message';
import { ChatSocketManager } from '../common/socket';
import ApiComponent from '../components/ApiComponent';
import ConversationSidebar from '../components/ConversationSidebar';
import CookieInfo from '../components/CookieInfo';
import { renderMessages } from '../components/Messages';

export default function ChatPage() {
  const [sid, setSid] = useState<string | null>(null);

  const [socket, setSocket] = useState<ChatSocketManager | undefined>();

  const [messages, setMessages] = useState<IMessage[]>([]);

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
    manager.onChatMessageHandlers.addListener(msg => {
      setMessages(oldMsgs => [...oldMsgs, msg]);
    });

    manager.connect();
    setSocket(manager);

    return () => {
      manager.disconnect();
      manager.clearAllEventHandlers();
      setSid(null);
      setSocket(undefined);
      console.log('Removed manager instance');
    };
  }, []);

  const sendMessage = (text: string) => {
    socket?.sendMessage({ content: text });
  };

  return (
    <div
      style={{
        height: '600px',
        position: 'relative',
      }}>
      <MainContainer responsive>
        <ConversationSidebar />
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back />
            <Avatar src={groupAvatarUrl2('Default Room')} name="Zoe" />
            <ConversationHeader.Content userName="Default Room" info="Active 0 mins ago" />
            <ConversationHeader.Actions>
              <VoiceCallButton />
              <VideoCallButton />
              <InfoButton />
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList typingIndicator={<TypingIndicator content="Nobody is typing" />}>
            <MessageSeparator content="Your conversation starts here." />

            {renderMessages(messages, auth?.user)}
          </MessageList>
          <MessageInput placeholder="Type message here" onSend={sendMessage} />
        </ChatContainer>

        <Sidebar position="right">
          <ExpansionPanel open title="INFO">
            <p>
              You are logged in as <b>{auth?.user?.name}</b>
            </p>
            <CookieInfo />
          </ExpansionPanel>
          <ExpansionPanel open title="DEBUG INFO">
            <ApiComponent />
            <p>Your SID: {sid}</p>
            <p>Your username: {auth?.user?.name}</p>
            <p>Your user ID: {auth?.user?.id}</p>
          </ExpansionPanel>
          <ExpansionPanel title="OPTIONS">
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <button className="btn btn-primary" onClick={() => auth?.signOut()}>
              Logout
            </button>
          </ExpansionPanel>
        </Sidebar>
      </MainContainer>
    </div>
  );
}
