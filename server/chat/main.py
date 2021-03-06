from typing import Dict
from flask_socketio import Namespace, emit, join_room, leave_room, send
from flask import request
import shortuuid
from datetime import datetime
from errors.room import RoomNotFoundError

from logger import logger as log
from rooms.room import Room
from rooms.manager import room_manager
from users.manager import user_manager
from errors.auth import InvalidUserIdError
from users.user import User


MSG_TYPE_DEFAULT = 0
MSG_TYPE_USER_JOINED = 1
MSG_TYPE_USER_LEFT = 2


now = lambda: int(datetime.now().timestamp())


def broadcast_room_joined(user: User, room: str):
  """
  Broadcasts to room that user has joined 
  """
  msg = {
    'id': shortuuid.random(length=10),
    'type': MSG_TYPE_USER_JOINED,
    'user': user.to_dict(),
    'timestamp': now()
  }
  emit('chat_message', msg, to=room)


def broadcast_room_left(user: User, room: str):
  """
  Broadcasts to room that user has left 
  """
  msg = {
    'id': shortuuid.random(length=10),
    'type': MSG_TYPE_USER_LEFT,
    'user': user.to_dict(),
    'timestamp': now()
  }
  emit('chat_message', msg, to=room)


class ChatNamespace(Namespace):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.sessions: Dict[str, User] = {}

    def _set_socketio(self, socketio):
        super()._set_socketio(socketio)
        user_manager.register_socket(self.socketio)
        room_manager.register_socket(self.socketio)

    def _remove_room_if_empty(self, room_id: str, also_if_one_user=False):
      """
      param also_if_one_user: remove if one user, not empty
      """
      lst = user_manager.find_users_in_room(room_id)
      target_len = 1 if also_if_one_user else 0
      if len(lst) <= target_len:
        log.debug(f'Cleaning up empty room id={room_id} unless permament')
        room_manager.delete_room(room_id, skip_permament=True)

    def on_connect(self):
        user_id = request.headers['X-USER-ID'] if 'X-USER-ID' in request.headers else None
        if not user_id in user_manager.users:
          raise InvalidUserIdError()

        user = user_manager.users[user_id]
        sid = request.sid
        user.session_id = sid
        self.sessions[sid] = user

        if user.current_room == None or user.current_room.id not in room_manager.rooms:
          user.current_room = room_manager.default_room
        self._join_room(user, user.current_room)

        log.info(f'{user} connected to chat (sid={sid})')
        self._update_user_list()

    def on_disconnect(self):
      sid = request.sid
      if sid in self.sessions:
        user = self.sessions[sid]
        user.session_id = None
        user.meta['disconnected_at'] = now()

        user_room_id = user.current_room.id
        broadcast_room_left(user, user_room_id)
        self._remove_room_if_empty(user_room_id, also_if_one_user=True)

        del self.sessions[sid]
        log.info(f'{user} disconnected from chat (sid={sid})')
        self._update_user_list()
      else:
        log.warn(f'Disconnected invalid session sid={sid}')

    def on_switch_room(self, data):
      room_id = data['room_id']
      room = room_manager.by_id(room_id)
      if room == None:
        raise RoomNotFoundError({'room_id': room_id})

      requester = self.sessions[request.sid]
      prev_room_id = requester.current_room.id
      leave_room(prev_room_id)
      broadcast_room_left(requester, prev_room_id)
      
      requester.current_room = room
      self._remove_room_if_empty(prev_room_id)
      self._join_room(requester, room)

      log.info(f'{requester} has joined {room}')
      self._update_user_list()

    # @socketio.on('send_message`, namespace='/chat')
    def on_send_message(self, data):
        sid = request.sid
        sender = self.sessions[sid]

        content = data['content'] if 'content' in data else None
        url = data['url'] if 'url' in data else None

        # decorate message content with metadata
        data['id'] = shortuuid.random(length=10)
        data['sender'] = sender.to_dict()
        data['type'] = MSG_TYPE_DEFAULT
        data['timestamp'] = now()

        msg_value = content if content else 'url: ' + url
        log.debug(f'[{sender} -> {sender.current_room}]: {msg_value}')
        emit('chat_message', data, to=sender.current_room.id)

    def _join_room(self, requester: User, room: Room):
      broadcast_room_joined(requester, room.id)
      join_room(room.id)
      emit('current_room_changed', room.to_dict())

    def _update_user_list(self):
      """
      Broadcasts an updated user list to all clients
      """
      users = list(map(lambda u: u.to_dict(), user_manager.users.values()));
      emit('user_list_changed', users, broadcast=True)
