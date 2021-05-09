from typing import Dict, Union
from users.user import User
from errors.user import UserAlreadyExistsError


class UserManager:
  def __init__(self):
    self.users: Dict[User] = dict()

  def name_exists(self, name: str) -> bool:
    return any(map(lambda u: u.name == name, self.users.values()))

  def by_id(self, user_id: str) -> Union[User, None]:
    return self.users[user_id] if user_id in self.users else None

  def by_name(self, user_name: str) -> Union[User, None]:
    try:
      return next(u for u in self.users.values() if u.name == user_name)
    except:
      return None

  def create_user(self, name: str, session_id: str=None) -> User:
    if self.name_exists(name):
      raise UserAlreadyExistsError(payload={'username': name})

    user = User(name, session_id)
    self.users[user.id] = user
    return user

  def delete_user(self, user_id: str):
    if user_id in self.users:
      del self.users[user_id]
    else:
      raise Exception(f"Cannot delete user with id {user_id} because it doesnt exist already")


user_manager = UserManager()
  