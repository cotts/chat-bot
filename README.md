# Chat-bot Module

## This is a BOT to get Stock Values

- This bot is a module to be used on [Chat Api Bot](https://github.com/cotts/chat-api-bot)

<br/>
<hr>

### Requirements

- Websocket
- RabbitMQ

### About

This Bot is a module that connect to `Chat Bot API` via websocket and store the results on a message broker and return the parsed message to a specific room via websocket.

<br/>
<hr/>
<br/>

## How to use

<br/>

1- Install dependencies

```bash
npm i
##or
yarn
```

2- Set environment keys

```bash
RABBITMQ_SERVER= # RabbitMQ Server Connection String
RABBITMQ_QUEUE=  # RabbitMQ Queue name
SOCKET_SERVER=   # Websocket server  (This Server must be allowed on Websocket CORS LIST)
```

3 - Run Service

> 3.1 - In Development Mode

```bash
npm run dev
#or
yarn dev
```

> 3.2 - In Production Mode

```bash
npm start
#or
yarn start
```
