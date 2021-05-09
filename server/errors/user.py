from errors.api import ApiError


class UserAlreadyExistsError(ApiError):
  def __init__(self, payload=None):
    super().__init__('user_already_exists', status_code=400, payload=payload)
