import { Message, Avatar, MessageSeparator } from '@chatscope/chat-ui-kit-react';
import * as React from 'react';

import { userAvatarUrl } from '../common/avatars';
import { IMessage, isTextMessage, ITextMessage, MessageType } from '../common/message';
import { IUser } from '../common/user';
import { timestampToLocaleTime } from '../common/utils';

export function renderMessages(messages: IMessage[], sender?: IUser | null) {
  const count = messages.length;
  return messages.map((msg, idx, arr) => {
    const isFirst = idx === 0;
    const isLast = idx === count - 1;

    const prev = isFirst ? undefined : arr[idx - 1];
    const next = isLast ? undefined : arr[idx + 1];

    if (!isTextMessage(msg)) {
      const { user, timestamp } = msg;
      const time = timestampToLocaleTime(timestamp);
      if (msg.type === MessageType.USER_JOINED) {
        return <MessageSeparator content={`${user.name} has joined the room at ${time}`} />;
      } else if (msg.type === MessageType.USER_LEFT) {
        return <MessageSeparator content={`${user.name} has left the room at ${time}`} />;
      } else throw new Error('this should never happen');
    }

    const isUserFirst = isFirst || !isTextMessage(prev) || msg.sender.id !== prev?.sender.id;
    const isUserLast = isLast || !isTextMessage(next) || msg.sender.id !== next?.sender.id;

    const isSelf = msg.sender.id === sender?.id;

    return renderMessage(msg, isSelf, isUserFirst, isUserLast);
  });
}

function renderMessage(
  msg: ITextMessage,
  isSelf: boolean,
  isUserFirst: boolean,
  isUserLast: boolean
) {
  const shouldRenderAvatar = !isSelf && isUserFirst;
  const avatarUrl = userAvatarUrl(msg.sender.id);
  const sentTime = timestampToLocaleTime(msg.timestamp);

  const position =
    isUserFirst && isUserLast ? 'single' : isUserFirst ? 'first' : isUserLast ? 'last' : 'normal';

  return (
    <Message
      key={msg.id}
      model={{
        message: msg.content,
        sentTime,
        sender: msg.sender.id,
        direction: isSelf ? 'outgoing' : 'incoming',
        position,
      }}
      avatarSpacer={!isUserFirst && !isSelf}>
      <Message.Header sender={msg.sender.name} />
      {isUserLast && messageFooter(sentTime)}
      {shouldRenderAvatar && <Avatar src={avatarUrl} name="Zoe" />}
    </Message>
  );
}

const messageFooter = (sentTime: string) => (
  <Message.Footer>
    <div className="cs-message__sent-time" style={{ display: 'block' }}>
      {sentTime}
    </div>
  </Message.Footer>
);
