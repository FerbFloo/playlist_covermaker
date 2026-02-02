import Wizard from './components/Wizard'
import './index.css'

function App() {
  return (
    <div className="app-container" style={{ height: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Wizard />
      <div style={{
        position: 'absolute',
        top: '8px',
        left: '12px',
        fontSize: '10px',
        color: 'rgba(0,0,0,0.3)',
        pointerEvents: 'none',
        zIndex: 1000,
        fontFamily: 'monospace'
      }}>
        v{__APP_VERSION__}
      </div>
    </div>
  )
}

export default App
