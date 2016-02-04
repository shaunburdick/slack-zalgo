'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger')();
const zalgo = require('to-zalgo');
const request = require('request');

class Server {

  /**
   * Constructor
   *
   * @constructor
   * @param {string} validationKey The validation key to use
   */
  constructor(validationKey) {
    this.validationKey = validationKey;
    if (!this.validationKey) {
      throw new Error('Validation Key is required');
    }

    this.app = express();
    this.port = 3000;

    // configure logging
    logger.stream = {
      write: (message) => {
        logger.info(message);
      },
    };
    this.app.use(require('morgan')('combined', { stream: logger.stream }));

    this.configureRoutes();
  }

  /**
   * Converts text to Zalgo
   *
   * @param  {string} good The good text
   * @return {string} evil The evil text
   */
  zalgo(good) {
    return zalgo(good);
  }

  /**
   * Configure the routes
   * @returns {Server} this
   */
  configureRoutes() {
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.post('/zalgo', (req, res) => {
      if (
        req.body && req.body.token && req.body.token === this.validationKey
        && req.body.text && req.body.command && req.body.response_url
      ) {
        switch (req.body.text) {
          case 'help':
            res.status(200).end(`Usage: ${req.body.command} [text]`);
            break;
          default:
            res.status(200).end('He comes...');
            request({
              method: 'POST',
              uri: req.body.response_url,
              json: true,
              body: {
                response_type: 'in_channel',
                text: this.zalgo(req.body.text),
              },
            }, (error) => {
              /* istanbul ignore next can't test slack connection errors */
              if (error) {
                logger.error('He couldn\'t come', error);
              }
            });
        }
      } else {
        res.status(401).end();
      }
    });

    this.app.get('/', (req, res) => {
      res.send('He comes');
    });

    return this;
  }

  /**
   * Start listening
   *
   * @param {integer} port The port to listen on
   * @returns {Server} This
   */
  start(port) {
    this.port = port || this.port;
    logger.info(`Your Validation Key is: ${this.validationKey}`);
    logger.info(`Starting on port: ${this.port}`);

    this.active = this.app.listen(this.port);

    return this;
  }

  /**
   * Stop listening
   *
   * @param {function} callback Callback when server is stopped
   * @returns {Server} This
   */
  stop(callback) {
    this.active.close(callback);
  }
}

module.exports = Server;
