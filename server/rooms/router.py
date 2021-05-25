from flask import Blueprint, jsonify, request

from logger import logger as log
from rooms.manager import room_manager
from errors.room import RoomAlreadyExistsError, RoomNotFoundError

rooms_router = Blueprint('rooms_router', __name__)

@rooms_router.route('/', methods=['GET'])
def get_users():
  return jsonify(list(map(lambda r: r.to_dict(), room_manager.rooms.values())))

@rooms_router.route('/<roomname>', methods=['GET'])
def get_single_user(roomname):
  param_type = request.args.get('by')
  lookup_param = request.view_args['roomname']

  if param_type == 'name':
    room = room_manager.by_name(lookup_param)
  else:
    room = room_manager.by_id(lookup_param)
  
  if room == None:
    return jsonify({'exists': False})
  else:
    return jsonify({
      'exists': True,
      'room': room.to_dict()
    })


@rooms_router.route('/', methods=['POST'])
def create_room():
  data = request.get_json()
  if not data or 'name' not in data:
    return 'No name field in request body', 400

  description = data['description'] if 'description' in data else ''
  room = room_manager.create_room(data['name'], description)
  log.info(f'Created room: {room}')
  
  return jsonify(room.to_dict()), 201


@rooms_router.route('/<room_id>', methods=['DELETE'])
def delete_room(room_id):
  id_to_delete = request.view_args.get('room_id')
  if id_to_delete == None:
    return 'Invalid delete request', 400

  room_manager.delete_room(id_to_delete)

  return jsonify({'deleted':True}), 204

### Error handlers

@rooms_router.errorhandler(RoomAlreadyExistsError)
def handle_room_already_exists(error):
  response = jsonify(error.to_dict())
  response.status_code = error.status_code
  return response

@rooms_router.errorhandler(RoomNotFoundError)
def handle_room_not_found(error):
  response = jsonify(error.to_dict())
  response.status_code = error.status_code
  return response
