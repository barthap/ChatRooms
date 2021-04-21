This directory contains simple HTML files to quickly test the API server without having to turn the React client app on.

## Important

Opening these files in browser directly from filesystem (`file://` URL in browser) may not work with WebSocket connections.
However, you can run the simplest Python server to host them:

1. `cd` into this directory
2. `python3 -m http.server 6000`
3. Now, the `browser_test.html` is available at http://localhost:6000/browser_test.html
