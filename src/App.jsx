import React, { useState } from 'react'
import './App.css'
import { useGame } from './context/GameContext'
import GameBoard from './components/GameBoard'
import InvestigationSheet from './components/InvestigationSheet'
import GameLog from './components/GameLog'
import LobbyScreen from './components/LobbyScreen'
import { ChatPanel, NotesPanel } from './components/ChatPanel'

function App() {
  const { gameState, localPlayer } = useGame();
  const [mobileTab, setMobileTab] = useState('sheet');

  if (gameState.phase === 'SETUP' || gameState.phase === 'LOBBY') {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <LobbyScreen />
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2>Sherlock</h2>
          <span style={{ fontSize: '0.8em', color: '#888' }}>Lobby: {gameState.lobbyCode}</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>Turn: <span style={{ color: gameState.currentPlayerId === localPlayer.id ? 'lime' : 'white' }}>
            {gameState.currentPlayerId === localPlayer.id ? 'YOU' : gameState.players.find(p => p.id === gameState.currentPlayerId)?.name}
          </span></div>
        </div>
      </header>

      <div className="game-area side-layout">
        <div className={`sheet-container main-view ${mobileTab === 'sheet' ? 'mobile-visible' : 'mobile-hidden'}`}>
          <InvestigationSheet />
          <GameLog />
        </div>
        <div className={`board-container side-panel ${mobileTab === 'board' ? 'mobile-visible' : 'mobile-hidden'}`}>
          <GameBoard />
          <ChatPanel />
          <NotesPanel />
        </div>
      </div>

      <nav className="mobile-nav">
        <button
          className={mobileTab === 'sheet' ? 'active' : ''}
          onClick={() => setMobileTab('sheet')}
        >
          Dochodzenie
        </button>
        <button
          className={mobileTab === 'board' ? 'active' : ''}
          onClick={() => setMobileTab('board')}
        >
          Plansza gry
        </button>
      </nav>
    </div>
  )
}

export default App
