export function renderScreen(state, requestAnimationFrame, currentPlayerId) {
  const screen = document.querySelector('#game-screen');
  const context = screen.getContext('2d')
  context.fillStyle = 'white'
  context.fillRect(0, 0, 10, 10)

  for (const playerId in state.players) {
    const player = state.players[playerId]

    context.fillStyle = 'black'
    context.fillRect(player.x, player.y, 1, 1)
  }

  for (const fruitId in state.fruits) {
    const fruit = state.fruits[fruitId]

    context.fillStyle = 'green'
    context.fillRect(fruit.x, fruit.y, 1, 1)
  }

  const currentPlayer = state.players[currentPlayerId]

  if(currentPlayer) {
      context.fillStyle = '#F0DB4F'
      context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)
  }

 requestAnimationFrame(() => renderScreen(state, requestAnimationFrame, currentPlayerId)) 
}
