export function createGame() {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 10,
      height: 10
    }
  }

  
  function start() {
    const frequency = 2000

    setInterval(addFruit, frequency)
}
  const observers = [];

  function subscribe(observerFunction) {
    observers.push(observerFunction)
  }

  function notifyAll(command) {
    for (const observerFunction of observers) {
      observerFunction(command)
    }
  }

  function setState(newState) {
    Object.assign(state, newState)
  }
  function addPlayer(command) {
    const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
    const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)
    const score = 0;

    const playerId = command.playerId

    state.players[playerId] = {
      x: playerX, y: playerY, score
    }

    notifyAll({
      type: 'add-player',
      playerId,
      playerX,
      playerY,
      score
    })
  }

  function removePlayer(command) {
    const playerId = command.playerId

    delete state.players[playerId]

    notifyAll({
      type: 'remove-player',
      playerId
    })
  }

  function addFruit(command) {
    const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000000)
    const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
    const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

    state.fruits[fruitId] = {
      x: fruitX, y: fruitY,
    }

    notifyAll({ 
      type: 'add-fruit',
      fruitId,
      fruitX,
      fruitY
    })
  }

  function removeFruit(command) {
    const fruitId = command.fruitId

    delete state.fruits[fruitId]

    notifyAll({
      type: 'remove-fruit',
      fruitId
    })
  }

  function setPlayerScore (command) {
    const player = state.players[command.playerId];
    player.score = command.playerScore 

    console.log(player);

    notifyAll({
      type: 'new-score',
      score: state.players
    })
  }

  function checkFruitColission(playerId) {
    const player = state.players[playerId];

    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId]

      if (fruit.x === player.x && fruit.y === player.y) {
        setPlayerScore({ playerId, playerScore: player.score += 1 })
        removeFruit({ fruitId })
      }
    }
  }

  function movePlayer(command) {
    const acceptedMoves = {
      ArrowUp(player) {
        if (player.y - 1 >= 0) {
          player.y -= 1
        }
      },
      ArrowDown(player) {
        if (player.y + 1 < state.screen.height) {
          player.y += 1
        }
      },
      ArrowLeft(player) {
        if (player.x - 1 >= 0) {
          player.x -= 1
        }
      },
      ArrowRight(player) {
        if (player.x + 1 < state.screen.width) {
          player.x += 1
        }
      }
    }


    const playerId = command.playerId
    const move = acceptedMoves[command.keyPressed];
    const player = state.players[playerId];


    if (player && move) {
      move(player)
      checkFruitColission(playerId)  
      notifyAll(command)
    }
  }

  return {
    movePlayer,
    state,
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
    setState,
    subscribe,
    start
  }
}
