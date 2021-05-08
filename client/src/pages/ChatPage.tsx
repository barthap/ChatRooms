import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
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
import React, { useState } from 'react';
import { io, Socket } from 'socket.io-client';

import ApiComponent from '../components/ApiComponent';
import ConversationSidebar from '../components/ConversationSidebar';

interface IMessage {
  sender_sid: string;
  content: string;
}

function renderMessage(key: string | number, msg: IMessage, selfSid?: string, lastSid?: string) {
  const isSelf = msg.sender_sid === selfSid;
  const isSameSenderAsLast = msg.sender_sid === lastSid;
  const shouldRenderAvatar = !isSelf && !isSameSenderAsLast;
  const avatarUrl = `https://identicon-api.herokuapp.com/${msg.sender_sid}/50?format=png`;

  return (
    <Message
      key={key}
      model={{
        message: msg.content,
        sentTime: '15 mins ago',
        sender: msg.sender_sid,
        direction: isSelf ? 'outgoing' : 'incoming',
        position: isSameSenderAsLast ? 'normal' : 'first',
      }}
      avatarSpacer={isSameSenderAsLast && !isSelf}>
      {shouldRenderAvatar && <Avatar src={avatarUrl} name="Zoe" />}
    </Message>
  );
}

export default function ChatPage() {
  // Set initial message input value to empty string
  const [messageInputValue, setMessageInputValue] = useState('');
  const [sid, setSid] = useState<string | null>(null);

  const [socket, setSocket] = useState<Socket | undefined>();

  const [messages, setMessages] = useState<IMessage[]>([]);

  console.count('Render');

  React.useEffect(() => {
    console.countReset('Render');

    const socket = io('http://localhost:5000/chat');
    socket.on('connect', () => {
      console.log('Connected to /chat with sid', socket.id);
      setSid(socket.id);
    });
    socket.on('disconnect', () => {
      console.log('Disconnected');
    });

    socket.on('chat_message', (msg: IMessage) => {
      console.log('Received message:', msg);
      setMessages(oldMsgs => [...oldMsgs, msg]);
    });

    setSocket(socket);

    return () => {
      setSid(null);
      setSocket(undefined);
      socket.disconnect();
      console.log('Disconnecting from socket...');
    };
  }, []);

  const sendMessage = (text: string) => {
    socket?.emit('send_message', { content: text });
    setMessageInputValue('');
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
            <Avatar src="https://i.pravatar.cc/100?a=9" name="Zoe" />
            <ConversationHeader.Content userName="Zoe" info="Active 10 mins ago" />
            <ConversationHeader.Actions>
              <VoiceCallButton />
              <VideoCallButton />
              <InfoButton />
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList typingIndicator={<TypingIndicator content="Zoe is typing" />}>
            <MessageSeparator content="Your conversation starts here." />

            {messages.map((msg, idx, msgs) =>
              renderMessage(
                idx,
                msg,
                sid ?? undefined,
                idx > 0 ? msgs[idx - 1].sender_sid : undefined
              )
            )}
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            value={messageInputValue}
            onChange={(val: string) => setMessageInputValue(val)}
            onSend={sendMessage}
          />
        </ChatContainer>

        <Sidebar position="right">
          <ExpansionPanel open title="INFO">
            <p>Hello World</p>
          </ExpansionPanel>
          <ExpansionPanel open title="DEBUG INFO">
            <ApiComponent />
            <p>Your SID: {sid}</p>
          </ExpansionPanel>
          <ExpansionPanel title="OPTIONS">
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
          </ExpansionPanel>
        </Sidebar>
      </MainContainer>
    </div>
  );
}

/*
            <Message
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Zoe',
                direction: 'incoming',
                position: 'single',
              }}>
              <Avatar src="https://i.pravatar.cc/100?a=9" name="Zoe" />
            </Message>

            <Message
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Patrik',
                direction: 'outgoing',
                position: 'single',
              }}
              avatarSpacer
            />
            <Message
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Zoe',
                direction: 'incoming',
                position: 'first',
              }}
              avatarSpacer
            />
            <Message
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Zoe',
                direction: 'incoming',
                position: 'normal',
              }}
              avatarSpacer
            />
            <Message
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Zoe',
                direction: 'incoming',
                position: 'normal',
              }}
              avatarSpacer
            />
            <Message
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Zoe',
                direction: 'incoming',
                position: 'last',
              }}>
              <Avatar src="https://i.pravatar.cc/100?a=9" name="Zoe" />
            </Message>

            <Message
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Patrik',
                direction: 'outgoing',
                position: 'first',
              }}
            />
            <Message
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Patrik',
                direction: 'outgoing',
                position: 'normal',
              }}
            />
            <Message
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Patrik',
                direction: 'outgoing',
                position: 'normal',
              }}
            />
            <Message
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Patrik',
                direction: 'outgoing',
                position: 'last',
              }}
            />

            <Message
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Zoe',
                direction: 'incoming',
                position: 'first',
              }}
              avatarSpacer
            />
            <Message
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Zoe',
                direction: 'incoming',
                position: 'last',
              }}>
              <Avatar src="https://i.pravatar.cc/100?a=9" name="Zoe" />
            </Message>
            */
