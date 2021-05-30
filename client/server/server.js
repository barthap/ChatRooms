const express = require('express');
const http = require('http');
const httpProxy = require('http-proxy');
const path = require('path');

// Constants
const PORT = process.env.GATEWAY_PORT || 4121;
const HOST = '0.0.0.0';

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';

const CLIENT_BUILD_PATH = path.join(__dirname, '../build');

console.log('Proxied API URL:', SERVER_URL);

// App
const app = express();
const apiProxy = httpProxy.createProxyServer({
  ws: true,
  target: SERVER_URL,
});

// Static files - built React App
app.use(express.static(CLIENT_BUILD_PATH));

//redirect all API calls to API server (Flask HTTP)
app.all('/api/*', function (req, res) {
  console.log(req.method.toUpperCase(), req.path);
  req.url = req.url.replace('/api', '');
  apiProxy.web(req, res);
});

//redicrect SocketIO HTTP requests to API server (flask-socketio)
app.all('/socket.io/*', function (req, res) {
  console.log(`proxying ${req.method.toUpperCase()} request`, req.url);
  apiProxy.web(req, res);
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function (_request, response) {
  console.log(_request.method, _request.path);
  response.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

const server = http.createServer(app);

// Proxy WebSocket requests
server.on('upgrade', function (req, socket, head) {
  console.log('proxying upgrade request', req.url);
  apiProxy.ws(req, socket, head);
});

server.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
