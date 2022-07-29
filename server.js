import http from 'http';
import express from 'express';
import { Server } from 'socket.io';

import { createGame } from './public/game.js'

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);
const game = createGame();
game.start();

game.subscribe((command) => {
  console.log(`> Emitting ${command.type}`);
  sockets.emit(command.type, command)
})

sockets.on('connection', (socket) => {
  const playerId = socket.id
  console.log(`> player connected on server with id: ${playerId}`);

  game.addPlayer({ playerId })
  socket.emit('setup', game.state)
  
  socket.on('move-player', (command) => {
    command.playerId = playerId
    command.type = 'move-player'

    game.movePlayer(command)
  })
  socket.on('disconnect', () => {
    game.removePlayer({ playerId })
  })
})


app.use(express.static('public'))

server.listen(3000, () => console.log('> running on 8080'));