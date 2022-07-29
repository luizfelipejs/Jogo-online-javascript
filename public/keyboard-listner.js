export function createKeyboardListener() {
  const state = {
    observers: [],
    playerId: null
  }

  function registerPlayerId (playerId) {
    state.playerId = playerId
  }
  
  function subscribe(observerFunction) {
    state.observers.push(observerFunction)
  }

  function notifyAll(command) {
    for (const observerId in state.observers) {
      const observerFunction = state.observers[observerId]

      observerFunction(command)
    }
  }

  function handleKeyDown(event) {
    const keyPressed = event.key;

    const command = {
      type: 'move-player',
      playerId: state.playerId,
      keyPressed
    }
    
    notifyAll(command)
  }

  document.addEventListener("keydown", handleKeyDown)

  return {
    subscribe,
    registerPlayerId
  }
}