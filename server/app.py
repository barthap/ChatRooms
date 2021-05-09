import logging
from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit, send
import os
from logger import logger as log

from chat.main import ChatNamespace
from users.router import users_router
from errors.auth import InvalidUserIdError

app = Flask(__name__)                           # Create Flask instance
app.config['SECRET_KEY'] = 'ChatRoomsSecret'    # Change me
cors = CORS(app)                                # Enable global CORS for HTTP requests

# Create the Socket.io instance, also enable CORS
socketio = SocketIO(app, cors_allowed_origins='*', logger=True)

@app.route('/')
def hello_world():
    return 'Hello, Chat!'

@app.route('/health')
def health():
    """
    API Endpoint to check if server is responding correctly.
    Client can send `GET /api/health` to check if server is ready.
    """
    return 'OK'

app.register_blueprint(users_router, url_prefix='/users')


################################################

@socketio.on('connect')
def test_connect(**kwargs):
    sid = request.sid
    log.debug(f'Client with sid: {sid} connected to global namespace')

@socketio.on('disconnect')
def test_disconnect(**kwargs):
    log.debug(f'Client with sid: {request.sid} disconnected from global namespace')

@socketio.on('send_message')
def handle_message(data):
    content = data['content']
    log.warn('Received chat message in global namespace: ' + content)
    log.warn('Did you forget to connect to a /chat namespace?')


# handles all namespaces without an explicit error handler
@socketio.on_error_default
def default_error_handler(e):
    if isinstance(e, InvalidUserIdError):
        log.warn('Invalid user ID')
        raise e

    event = request.event['message']
    log.error(f'Socket.IO Error during processing {event} message:')
    log.error(e)

# Register the /chat socket.io namespace
socketio.on_namespace(ChatNamespace('/chat'))

# main
if __name__ == '__main__':
    port = os.environ.get('SERVER_PORT', 5000)
    log.info('Starting server at port ' + str(port))
    socketio.run(app, host="0.0.0.0", port=int(port), debug=True)
