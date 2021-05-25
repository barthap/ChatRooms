from typing import Dict
from flask_socketio import Namespace, emit, join_room, leave_room, send
from flask import request
import shortuuid
from datetime import datetime
from errors.room import RoomNotFoundError

from logger import logger as log
from rooms.manager import room_manager
from users.manager import user_manager
from errors.auth import InvalidUserIdError
from users.user import User


MSG_TYPE_DEFAULT = 0
MSG_TYPE_USER_JOINED = 1
MSG_TYPE_USER_LEFT = 2


def broadcast_room_joined(user: User, room: str):
  """
  Broadcasts to room that user has joined 
  """
  msg = {
    'id': shortuuid.random(length=10),
    'type': MSG_TYPE_USER_JOINED,
    'user': user.to_dict()
  }
  emit('chat_message', msg, to=room)


def broadcast_room_left(user: User, room: str):
  """
  Broadcasts to room that user has left 
  """
  msg = {
    'id': shortuuid.random(length=10),
    'type': MSG_TYPE_USER_LEFT,
    'user': user.to_dict()
  }
  emit('chat_message', msg, to=room)


class ChatNamespace(Namespace):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.sessions: Dict[str, User] = {}

    def on_connect(self):
        user_id = request.headers['X-USER-ID'] if 'X-USER-ID' in request.headers else None
        if not user_id in user_manager.users:
          raise InvalidUserIdError()

        user = user_manager.users[user_id]
        if user.current_room == None:
          user.current_room = room_manager.default_room

        sid = request.sid
        user.session_id = sid
        self.sessions[sid] = user

        broadcast_room_joined(user, user.current_room.id)
        join_room(user.current_room.id)
        emit('room_changed', user.current_room.to_dict())
        log.info(f'{user} connected to chat (sid={sid})')

    def on_disconnect(self):
      sid = request.sid
      if sid in self.sessions:
        user = self.sessions[sid]
        user.session_id = None
        user.meta['disconnected_at'] = int(datetime.now().timestamp())
        broadcast_room_left(user, user.current_room.id)

        del self.sessions[sid]
        log.info(f'{user} disconnected from chat (sid={sid})')
      else:
        log.warn(f'Disconnected invalid session sid={sid}')

    def on_switch_room(self, data):
      room_id = data['room_id']
      room = room_manager.by_id(room_id)
      if room == None:
        raise RoomNotFoundError({'room_id': room_id})

      requester = self.sessions[request.sid]
      leave_room(requester.current_room.id)
      broadcast_room_left(requester, requester.current_room.id)

      requester.current_room = room
      broadcast_room_joined(requester, room.id)
      join_room(room.id)
      emit('room_changed', room.to_dict())

      log.info(f'{requester} has joined {room}')

    # @socketio.on('send_message`)
    def on_send_message(self, data):
        sid = request.sid
        sender = self.sessions[sid]
        content = data['content']

        # decorate message content with metadata
        data['id'] = shortuuid.random(length=10)
        data['sender'] = sender.to_dict()
        data['type'] = MSG_TYPE_DEFAULT

        log.debug(f'[{sender} -> {sender.current_room}]: {content}')

        emit('chat_message', data, to=sender.current_room.id)
