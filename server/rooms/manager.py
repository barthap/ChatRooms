from typing import Dict, Union
from datetime import datetime
from errors.room import RoomAlreadyExistsError, RoomNotFoundError

from logger import logger as log
from rooms.room import Room


EXPIRE_TIME = 10 * 60 # 10 minutes

class RoomManager:
  def __init__(self):
    default_room = Room(name='Default Room', description='You join here by default')
    default_room.id = '_default'

    test_room = Room('Testing', 'A permament room used for testing')
    test_room.id = '_test'

    self.default_room = default_room
    self.rooms: Dict[Room] = {'_default': default_room, '_test': test_room}

  def name_exists(self, name: str) -> bool:
    return any(map(lambda r: r.name == name, self.rooms.values()))

  def by_id(self, room_id: str) -> Union[Room, None]:
    return self.rooms[room_id] if room_id in self.rooms else None

  def by_name(self, room_name: str) -> Union[Room, None]:
    try:
      return next(r for r in self.rooms.values() if r.name == room_name)
    except:
      return None

  # def is_expired(self, user_id: str) -> bool:
  #   user = self.by_id(user_id)
  #   if user == None:
  #     return False
  #   now = int(datetime.now().timestamp())
  #   disconnected_time = user.meta['disconnected_at'] if 'disconnected_at' in user.meta else 0
  #   return user.session_id == None and (now - disconnected_time) > EXPIRE_TIME

  def create_room(self, name: str, description: str = '') -> Room:
    if self.name_exists(name):
      raise RoomAlreadyExistsError(payload={'name': name})

    room = Room(name, description)
    self.rooms[room.id] = room
    return room

  def delete_room(self, room_id: str):
    if room_id in self.rooms:
      log.info(f'Deleting {self.rooms[room_id]}')
      del self.rooms[room_id]
    else:
      raise RoomNotFoundError(f"Cannot delete user with id {room_id} because it doesnt exist already")


room_manager = RoomManager()
  