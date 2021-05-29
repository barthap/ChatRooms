import {
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
import React, { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useAuth } from '../common/auth';
import { groupAvatarUrl2 } from '../common/avatars';
import { IMessage } from '../common/message';
import { IRoom } from '../common/room';
import { ChatSocketManager } from '../common/socket';
import { renderMessages } from '../components/Messages';
import MessageInputEx, { OnSendRequest } from './MessageInputEx';

const ContainerHeader = ({ room: { name, description }, as: _as }: { room: IRoom; as: any }) => (
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

export default function ConversationContainer({
  socket,
  room,
  auth,
}: {
  socket?: ChatSocketManager;
  room: IRoom;
  auth?: ReturnType<typeof useAuth>;
}) {
  const [messages, setMessages] = useState<IMessage[]>([]);

  // manage socket listeners
  useEffect(() => {
    const listener = socket?.onChatMessageHandlers.addListener(msg => {
      // a new message has arrived
      setMessages(oldMsgs => [...oldMsgs, msg]);
    });
    return () => {
      listener && socket?.onChatMessageHandlers.removeListener(listener);
    };
  }, [socket]);

  // clear messages when room changed
  useEffect(() => setMessages([]), [room]);

  const sendMessage: OnSendRequest = message => {
    socket?.sendMessage(message);
  };

  return (
    <ChatContainer>
      <ContainerHeader room={room} as={ConversationHeader} />
      <MessageList>
        <MessageSeparator content="Your conversation starts here." />
        {renderMessages(messages, auth?.user)}
      </MessageList>
      <MessageInputEx as={MessageInput} onSend={sendMessage} />
    </ChatContainer>
  );
}
