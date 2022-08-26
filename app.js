import createBareServer from '@tomphttp/bare-server-node';
import http from 'http';
import nodeStatic from 'node-static';
import * as custombare from './static/customBare.mjs';

const PORT = process.env.PORT || 3000;
const bareServer = createBareServer('/bare/', {
  logErrors: false,
  localAddress: undefined
});

const serve = new nodeStatic.Server('static/');

const server = http.createServer();

server.on('request', (request, response) => {
  if (custombare.route(request, response)) return true;
  
  if (bareServer.shouldRoute(request)) {
    bareServer.routeRequest(request, response);
  } else {
    serve.serve(request, response);
  }
});
server.on('upgrade', (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
  bareServer.routeUpgrade(req, socket, head);
  } else {
  socket.end();
  }
});

server.listen(PORT);

console.log(`Server running at http://localhost:${PORT}/.`);
