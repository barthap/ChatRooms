from flask import Blueprint, jsonify, request

from users.manager import user_manager
from errors.user import UserAlreadyExistsError, UserNotFoundError

users_router = Blueprint('users_router', __name__)

@users_router.route('/', methods=['GET'])
def get_users():
  return jsonify(list(map(lambda u: u.to_dict(), user_manager.users.values())))

@users_router.route('/<username>', methods=['GET'])
def get_single_user(username):
  param_type = request.args.get('by')
  lookup_param = request.view_args['username']

  if param_type == 'name':
    user = user_manager.by_name(lookup_param)
  else:
    user = user_manager.by_id(lookup_param)
  
  if user == None:
    return jsonify({'exists': False})
  else:
    return jsonify({
      'exists': True,
      'user': user.to_dict()
    })


@users_router.route('/', methods=['POST'])
def create_user():
  data = request.get_json()
  if not data or 'username' not in data:
    return 'No username field in request body', 400

  user = user_manager.create_user(data['username'])
  print(f'Created user: {user}')
  
  return jsonify(user.to_dict()), 201


@users_router.route('/<user_id>', methods=['DELETE'])
def delete_user(user_id):
  id_to_delete = request.view_args.get('user_id')
  if id_to_delete == None:
    return 'Invalid delete request', 400

  user_manager.delete_user(id_to_delete)

  return jsonify({'deleted':True}), 204

### Error handlers

@users_router.errorhandler(UserAlreadyExistsError)
def handle_username_already_exists(error):
  response = jsonify(error.to_dict())
  response.status_code = error.status_code
  return response

@users_router.errorhandler(UserNotFoundError)
def handle_user_not_found(error):
  response = jsonify(error.to_dict())
  response.status_code = error.status_code
  return response
