from flask_socketio import ConnectionRefusedError


class InvalidUserIdError(ConnectionRefusedError):
  def __init__(self):
    super().__init__('invalid_user_id')
