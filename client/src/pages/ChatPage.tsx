import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Sidebar,
  Search,
  ConversationList,
  Conversation,
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

import ApiComponent from '../components/ApiComponent';

export default function ChatPage() {
  // Set initial message input value to empty string
  const [messageInputValue, setMessageInputValue] = useState('');
  return (
    <div
      style={{
        height: '600px',
        position: 'relative',
      }}>
      <MainContainer responsive>
        <Sidebar position="left" scrollable={false}>
          <Search placeholder="Search..." />
          <ConversationList>
            <Conversation name="Lilly" lastSenderName="Lilly" info="Yes i can do it for you">
              <Avatar src="https://i.pravatar.cc/100?a=1" name="Lilly" status="available" />
            </Conversation>

            <Conversation name="Joe" lastSenderName="Joe" info="Yes i can do it for you">
              <Avatar src="https://i.pravatar.cc/100?a=2" name="Joe" status="dnd" />
            </Conversation>

            <Conversation
              name="Emily"
              lastSenderName="Emily"
              info="Yes i can do it for you"
              unreadCnt={3}>
              <Avatar src="https://i.pravatar.cc/100?aa=3" name="Emily" status="available" />
            </Conversation>

            <Conversation name="Kai" lastSenderName="Kai" info="Yes i can do it for you" unreadDot>
              <Avatar src="https://i.pravatar.cc/100?a=4" name="Kai" status="unavailable" />
            </Conversation>

            <Conversation name="Akane" lastSenderName="Akane" info="Yes i can do it for you">
              <Avatar src="https://i.pravatar.cc/100?a=5" name="Akane" status="eager" />
            </Conversation>

            <Conversation name="Eliot" lastSenderName="Eliot" info="Yes i can do it for you">
              <Avatar src="https://i.pravatar.cc/100?a=6" name="Eliot" status="away" />
            </Conversation>

            <Conversation name="Zoe" lastSenderName="Zoe" info="Yes i can do it for you" active>
              <Avatar src="https://i.pravatar.cc/100?a=9" name="Zoe" status="dnd" />
            </Conversation>

            <Conversation name="Patrik" lastSenderName="Patrik" info="Yes i can do it for you">
              <Avatar src="https://i.pravatar.cc/100?a=8" name="Patrik" status="invisible" />
            </Conversation>
          </ConversationList>
        </Sidebar>

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
            <MessageSeparator content="Saturday, 30 November 2019" />

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
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            value={messageInputValue}
            onChange={(val: string) => setMessageInputValue(val)}
            onSend={() => setMessageInputValue('')}
          />
        </ChatContainer>

        <Sidebar position="right">
          <ExpansionPanel open title="INFO">
            <p>HELLO WORLD</p>
          </ExpansionPanel>
          <ExpansionPanel title="DEBUG INFO">
            <ApiComponent />
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
