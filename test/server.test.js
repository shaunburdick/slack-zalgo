'use strict';

const test = require('tape');
const request = require('supertest');
const Server = require(`${process.env.PWD}/lib/server.js`);
const zalgoChars = require('to-zalgo/lib/chars');
const express = require('express');
const bodyParser = require('body-parser');

test('Validation Token', (assert) => {
  assert.plan(4);

  const token = 'foo';
  let s = new Server(token);

  assert.deepEqual([token], s.validationKey, 'Token should be set on instantiation');

  const multiToken = ['foo', 'bar', 'baz'];
  s = new Server(multiToken.join(','));
  assert.deepEqual(multiToken, s.validationKey, 'Multiple Tokens should be parsed');

  s = new Server(multiToken.join(',   '));
  assert.deepEqual(multiToken, s.validationKey, 'Multiple Tokens with spaces should be parsed');

  try {
    s = new Server();
  } catch (e) {
    assert.equal(e.message, 'Validation Key is required', 'Throws error on invalid token');
  }
});

test('Listen: Default Port', (assert) => {
  const s = new Server('foo');
  s.start();

  request(`http://localhost:${s.port}`)
    .get('/')
    .end((err, res) => {
      assert.error(err, 'No request error');
      assert.equal(res.text, 'He comes', 'Get default test page');
      s.stop(assert.end);
    });
});

test('Listen: Custom Port', (assert) => {
  const s = new Server('foo');
  s.start(3001);

  request(`http://localhost:${s.port}`)
    .get('/')
    .end((err, res) => {
      assert.error(err, 'No request error');
      assert.equal(res.text, 'He comes', 'Get default test page');
      s.stop(assert.end);
    });
});

test('Zalgo', (assert) => {
  const s = new Server('foo');
  const text = 'zalgo-text, it come';
  const evil = s.zalgo(text);
  assert.equal(zalgoChars.pattern.test(text), false);
  assert.equal(zalgoChars.pattern.test(evil), true);
  assert.end();
});

test('Slash Command', (assert) => {
  assert.plan(8);

  const token = 'foo';
  const s = new Server(token);
  const pure = 'foo';
  const command = '/zalgo';
  const responseUrl = 'http://localhost:3001';

  request(s.app)
    .post('/zalgo')
    .end((err, res) => {
      assert.equal(res.statusCode, 401, '401 on missing token');
    });

  request(s.app)
    .post('/zalgo')
    .type('form')
    .send({
      token: 'invalid',
    })
    .end((err, res) => {
      assert.equal(res.statusCode, 401, '401 on invalid token');
    });

  request(s.app)
    .post('/zalgo')
    .type('form')
    .send({
      token,
    })
    .end((err, res) => {
      assert.equal(res.statusCode, 401, '401 on missing text');
    });

  request(s.app)
    .post('/zalgo')
    .type('form')
    .send({
      token,
      text: pure,
    })
    .end((err, res) => {
      assert.equal(res.statusCode, 401, '401 on missing command');
    });

  request(s.app)
    .post('/zalgo')
    .type('form')
    .send({
      token,
      text: pure,
      command,
    })
    .end((err, res) => {
      assert.equal(res.statusCode, 401, '401 on missing response_url');
    });

  request(s.app)
    .post('/zalgo')
    .type('form')
    .send({
      token,
      text: pure,
      command,
      response_url: responseUrl,
    })
    .end((err, res) => {
      assert.equal(res.statusCode, 200, 'Valid Response');
    });

  // catch Zlago'd text Response
  const catchApp = express();
  catchApp.use(bodyParser.json());
  const catchActive = catchApp.listen(3001);

  catchApp.post('/', (req, res) => {
    if (req.body) {
      assert.equal(zalgoChars.pattern.test(req.body.text), true, 'Text has been zalgod');
    }

    res.status(200).end();
    catchActive.close();
  });

  request(s.app)
    .post('/zalgo')
    .type('form')
    .send({
      token,
      text: 'help',
      command,
      response_url: responseUrl,
    })
    .end((err, res) => {
      assert.equal(res.text, `Usage: ${command} [text]`, 'Valid Response');
    });
});
