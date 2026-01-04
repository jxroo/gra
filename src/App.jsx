import React from 'react'
import './App.css'
import { useGame } from './context/GameContext'
import GameBoard from './components/GameBoard'
import InvestigationSheet from './components/InvestigationSheet'
import GameLog from './components/GameLog'
import LobbyScreen from './components/LobbyScreen'
import { ChatPanel, NotesPanel } from './components/ChatPanel'
import GameRules from './components/GameRules'
import { ICONS } from './components/Icons'

function App() {
  const { gameState, localPlayer } = useGame();
  const [showRules, setShowRules] = React.useState(false);

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
        <div style={{ textAlign: 'right', display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div>Kolejka: <span style={{ color: gameState.currentPlayerId === localPlayer.id ? 'lime' : 'white' }}>
            {gameState.currentPlayerId === localPlayer.id ? 'TY' : gameState.players.find(p => p.id === gameState.currentPlayerId)?.name}
          </span></div>
          <button
            onClick={() => setShowRules(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            title="Zasady Gry"
          >
            <ICONS.Book size={20} />
            <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>Zasady gry</span>
          </button>
        </div>
      </header>

      <div className="game-area side-layout">
        <div className="sheet-container main-view">
          <InvestigationSheet />
          <GameLog />
        </div>
        <div className="board-container side-panel">
          <GameBoard />
          <ChatPanel />
          <NotesPanel />
        </div>
      </div>
      <GameRules isOpen={showRules} onClose={() => setShowRules(false)} />
    </div>
  )
}

export default App
