import React from 'react'
import './App.css'
import { useGame } from './context/GameContext'
import GameBoard from './components/GameBoard'
import InvestigationSheet from './components/InvestigationSheet'
import GameLog from './components/GameLog'

function App() {
  const { gameState, startGame } = useGame();

  if (gameState.phase === 'SETUP') {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h1>Sherlock - The Game</h1>
        <p>A digital implementation of the deduction board game.</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => startGame(3)}>Start 3 Player Game</button>
          <button onClick={() => startGame(4)}>Start 4 Player Game</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <h2>Sherlock</h2>
        <span>Turn: {gameState.currentPlayerId === 'p1' ? 'YOU' : gameState.currentPlayerId}</span>
      </header>

      <div className="game-area side-layout">
        <div className="sheet-container main-view">
          <InvestigationSheet />
          <GameLog />
        </div>
        <div className="board-container side-panel">
          <GameBoard />
        </div>
      </div>
    </div>
  )
}

export default App
