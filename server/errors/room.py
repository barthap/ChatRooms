from errors.api import ApiError


class RoomAlreadyExistsError(ApiError):
  def __init__(self, payload=None):
    super().__init__('room_already_exists', status_code=400, payload=payload)


class RoomNotFoundError(ApiError):
  def __init__(self, payload):
    super().__init__('room_not_found', status_code=404, payload=payload)
