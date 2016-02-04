'use strict';

const Server = require('./lib/server');
const server = new Server(process.env.ZALGO_VALIDATION_TOKEN);

server.start(process.env.ZALGO_PORT || process.env.PORT);
