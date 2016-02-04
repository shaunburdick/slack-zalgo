'use strict';

const winston = require('winston');

module.exports = () => {
  const logger = new winston.Logger({
    transports: [
      new (winston.transports.Console)({
        timestamp: true,
        prettyPrint: true,
        handleExceptions: true,
      }),
    ],
  });
  logger.cli();

  return logger;
};
