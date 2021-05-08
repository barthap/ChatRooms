import {
  Sidebar,
  Button,
  ConversationList,
  Conversation,
  Avatar,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export default function ConversationSidebar() {
  return (
    <Sidebar position="left" scrollable={false}>
      <Button border icon={<FontAwesomeIcon icon={faPlus} />}>
        Create new room
      </Button>
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
  );
}
