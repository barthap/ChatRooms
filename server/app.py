import logging
from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit, send, Namespace
import os


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

# listen to global event named "message"
@socketio.on('message')
def handle_message(data):
    print('received message: ' + data)

# listen to events named json
@socketio.on('json')
def handle_json(json):
    print('received json: ' + str(json))

# listen to events named "my event"
@socketio.on('my event')
def handle_my_custom_event(json):
    print('received my event: ' + str(json))

    # this sends information to global "message" event
    send('received my event: ' + str(json))

    # this emits event with name "responses"
    emit('responses', json)


################################################

@socketio.on('connect')
def test_connect(**kwargs):
    sid = request.sid
    print(f'Client with sid: {sid} connected to global namespace')

@socketio.on('disconnect')
def test_disconnect(**kwargs):
    print(f'Client with sid: {request.sid} disconnected from global namespace')


@socketio.on('send_message')
def handle_message(data):
    content = data['content']
    print('Received chat message in global namespace:', content)
    print('Did you forget to connect to a /chat namespace?')


class ChatNamespace(Namespace):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.sessions = {}

    def on_connect(self, **kwargs):
        sid = request.sid
        self.sessions[sid] = {'username': None}
        print(f'Client with sid: {sid} connected to chat!')

    def on_disconnect(self, **kwargs):
        del self.sessions[request.sid]
        print(f'Client with sid: {request.sid} disconnected from chat!')

    # @socketio.on('send_message`)
    def on_send_message(self, data):
        content = data['content']
        print('Received chat message:', content)
        data['sender_sid'] = request.sid
        # Change `broadcast=True` to `to="room_name_here"`
        emit('chat_message', data, broadcast=True)

socketio.on_namespace(ChatNamespace('/chat'))

if __name__ == '__main__':
    port = os.environ.get('SERVER_PORT', 5000)
    print('Starting server at port ' + str(port))
    socketio.run(app, host="0.0.0.0", port=int(port), debug=True)
