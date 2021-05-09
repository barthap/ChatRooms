from errors.api import ApiError


class UserAlreadyExistsError(ApiError):
  def __init__(self, payload=None):
    super().__init__('user_already_exists', status_code=400, payload=payload)


class UserNotFoundError(ApiError):
  def __init__(self, payload):
    super().__init__('user_not_found', status_code=404, payload=payload)
