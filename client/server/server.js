const express = require('express');
const httpProxy = require('http-proxy');
const path = require('path');

// Constants
const PORT = process.env.PORT || 4123;
const HOST = '0.0.0.0';

const API_URL = process.env.API_URL || 'http://localhost:5000';

const USERNAME = process.env.PANEL_USER || 'demo';
const PASSWORD = process.env.PANEL_PASS || 'demo';

const CLIENT_BUILD_PATH = path.join(__dirname, '../build');

// App
const app = express();
const apiProxy = httpProxy.createProxyServer();

// Static files
app.use(express.static(CLIENT_BUILD_PATH));

// for parsing application/json only in auth (do not use it in api proxy!)
app.use('/auth', express.json());

//simple credentials check (for frontend panel)
app.post('/auth', function (req, res) {
  const user = req.body.username;
  const pass = req.body.password;

  //just compare
  if (user === USERNAME && pass === PASSWORD) res.status(200).send('OK');
  else res.sendStatus(401);
});

//redirect all API calls to API server (Spring Boot)
app.all('/api/*', function (req, res) {
  req.url = req.url.replace('/api', '');
  apiProxy.web(req, res, { target: API_URL });
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function (_request, response) {
  response.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);