import shortuuid
from datetime import datetime

class Room(object):
  def __init__(self, name: str, description: str = '', is_permament=False):
    self.id = shortuuid.random(length=8)
    self.name = name
    self.description = description
    self.is_permament=is_permament
    self.meta = {
      'created_at': int(datetime.now().timestamp())
    }

  def to_dict(self):
    return {
      'id': self.id,
      'name': self.name,
      'description': self.description
    }

  def serialize(self):
    return self.to_dict()

  def __repr__(self):
    return f'Room[{self.id}, name={self.name}]'

  def __str__(self):
    return f'Room[{self.id}, name={self.name}]'
