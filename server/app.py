import logging
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO


app = Flask(__name__)                           # Create Flask instance
app.config['SECRET_KEY'] = 'ChatRoomsSecret'    # Change me
cors = CORS(app)                                # Enable global CORS for HTTP requests

# Create the Socket.io instance, also enable CORS
socketio = SocketIO(app, cors_allowed_origins='*')

@app.route('/')
def hello_world():
    return 'Hello, Chat!'

@app.route('/health')
def health():
    return 'OK'

@socketio.on('message')
def handle_message(data):
    print('received message: ' + data)

@socketio.on('json')
def handle_json(json):
    print('received json: ' + str(json))

@socketio.on('my event')
def handle_my_custom_event(json):
    print('received my event: ' + str(json))

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)

