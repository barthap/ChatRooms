from flask_socketio import Namespace, emit
from flask import request
import shortuuid

from users.manager import user_manager
from errors.auth import InvalidUserIdError


class ChatNamespace(Namespace):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.sessions = {}

    def on_connect(self, **kwargs):
        user_id = request.headers['X-USER-ID'] if 'X-USER-ID' in request.headers else None
        if not user_id in user_manager.users:
          raise InvalidUserIdError()

        user = user_manager.users[user_id]
        sid = request.sid
        user.session_id = sid
        self.sessions[sid] = user
        print(f'{user} connected to chat (sid={sid})')

    def on_disconnect(self, **kwargs):
      sid = request.sid
      if sid in self.sessions:
        user = self.sessions[sid]

        del self.sessions[sid]
        # user_manager.delete_user(user.id)

        print(f'{user} disconnected from chat (sid={sid})')
      else:
        print(f'Disconnected invalid session sid={sid}')

    # @socketio.on('send_message`)
    def on_send_message(self, data):
        content = data['content']
        print('Received chat message:', content)
        data['id'] = shortuuid.random(length=8)
        data['sender'] = self.sessions[request.sid].to_dict()
        # Change `broadcast=True` to `to="room_name_here"`
        emit('chat_message', data, broadcast=True)
