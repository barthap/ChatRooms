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
import React from 'react';

import { groupAvatarUrl2 } from '../common/avatars';

export default function ConversationSidebar() {
  return (
    <Sidebar position="left" scrollable={false}>
      <Button border icon={<FontAwesomeIcon icon={faPlus} />} className="mt-3 mb-3">
        Create new room
      </Button>
      <ConversationList>
        <Conversation name="Default Room" info="You join here when you log in" active>
          <Avatar src={groupAvatarUrl2('Default Room')} name="Default Room" status="available" />
        </Conversation>
        <Conversation name="Dummy Room 1" info="Just a dummy, you cannot join here yet">
          <Avatar src={groupAvatarUrl2('Dummy 1')} status="dnd" />
        </Conversation>
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
