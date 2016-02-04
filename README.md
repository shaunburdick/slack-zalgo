# Slack command to Zalgo text
[![Build Status](https://travis-ci.org/shaunburdick/slack-zalgo.svg)](https://travis-ci.org/shaunburdick/slack-zalgo) [![Coverage Status](https://coveralls.io/repos/shaunburdick/slack-zalgo/badge.svg?branch=master&service=github)](https://coveralls.io/github/shaunburdick/slack-zalgo?branch=master)

This slack command turns any text into zalgo.

## Example
coming soon!

## Install
1. Clone this [repository](https://github.com/shaunburdick/slack-zalgo.git)
2. `npm install`
3. Set your configuration environment variables
4. `npm start`

## Test
1. `npm install` (make sure your NODE_ENV != `production`)
2. `npm test`

## Docker
Build an image using `docker build -t your_image:tag`

Official Image [shaunburdick/slack-zalgo](https://registry.hub.docker.com/u/shaunburdick/slack-zalgo/)

### Configuration Environment Variables
You can set the configuration of the bot by using environment variables. _ENVIRONMENT_VARIABLE_=Default Value
- _ZALGO_VALIDATION_TOKEN_=, the validation token for your command app, separate multiple with comma (,)
- _ZALGO_PORT_=3000, what port he listens on

Set them using the `-e` flag while running docker:

```
docker run -it \
-e ZALGO_VALIDATION_TOKEN=aslkasjlkasd \
shaunburdick/slack-zalgo:latest
```

## Contributing
1. Create a new branch, please don't work in master directly.
2. Add failing tests for the change you want to make (if appliciable). Run `npm test` to see the tests fail.
3. Fix stuff.
4. Run `npm test` to see if the tests pass. Repeat steps 2-4 until done.
5. Check code coverage `npm run coverage` and add test paths as needed.
6. Update the documentation to reflect any changes.
7. Push to your fork and submit a pull request.
