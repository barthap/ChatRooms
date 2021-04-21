import logging
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO, emit, send


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

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
