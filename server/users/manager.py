from typing import Dict, List, Union
from flask_socketio import SocketIO
from datetime import datetime

from users.user import User
from errors.user import UserAlreadyExistsError, UserNotFoundError
from logger import logger as log


EXPIRE_TIME = 60 # 60 seconds

class UserManager:
  def __init__(self):
    self.users: Dict[str, User] = dict()
    self.socketio: SocketIO = None

  def register_socket(self, socketio: SocketIO):
    self.socketio = socketio

  def name_exists(self, name: str) -> bool:
    return any(map(lambda u: u.name == name, self.users.values()))

  def by_id(self, user_id: str) -> Union[User, None]:
    return self.users[user_id] if user_id in self.users else None

  def by_name(self, user_name: str) -> Union[User, None]:
    try:
      return next(u for u in self.users.values() if u.name == user_name)
    except:
      return None

  def is_expired(self, user_id: str) -> bool:
    user = self.by_id(user_id)
    if user == None:
      return False
    now = int(datetime.now().timestamp())
    disconnected_time = user.meta['disconnected_at'] if 'disconnected_at' in user.meta else 0
    return user.session_id == None and (now - disconnected_time) > EXPIRE_TIME

  def create_user(self, name: str, session_id: str=None) -> User:
    if self.name_exists(name):
      usr = self.by_name(name)
      if self.is_expired(usr.id):
        log.debug(f'User {name} exists, but its expired, removing')
        self.delete_user(usr.id)
      else:
        raise UserAlreadyExistsError(payload={'username': name})

    user = User(name, session_id)
    self.users[user.id] = user
    return user

  def delete_user(self, user_id: str):
    if user_id in self.users:
      log.info(f'Deleting {self.users[user_id]}')
      del self.users[user_id]
    else:
      raise UserNotFoundError(f"Cannot delete user with id {user_id} because it doesnt exist already")

  def find_users_in_room(self, room_id: str) -> List[User]:
    return list(filter(lambda u: u.current_room != None and u.current_room.id == room_id, self.users.values()))


user_manager = UserManager()
  