import shortuuid
from datetime import datetime

class User(object):
  def __init__(self, name: str, session_id: str=None):
    self.id = shortuuid.random(length=5)
    self.name = name
    self.session_id = session_id
    self.meta = {
      'created_at': int(datetime.now().timestamp())
    }

  def to_dict(self):
    return {
      'name': self.name,
      'id': self.id,
      'session_id': self.session_id
    }

  def serialize(self):
    return self.to_dict()

  def __repr__(self):
    return f'User[id={self.id}, name={self.name}]'

  def __str__(self):
    return f'User[id={self.id}, name={self.name}]'
