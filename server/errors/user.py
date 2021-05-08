from errors.api import ApiError


class UserAlreadyExistsError(ApiError):
  def __init__(self, message, payload=None):
    super().__init__(message, status_code=400, payload=payload)
