import { useStore } from '../store'
import { readableTime } from './LeaderBoard'

export const Finished = (): JSX.Element => {
  const [restartRun, time] = useStore(({ actions: { restartRun }, finished }) => [restartRun, finished])

  const returnToPortfolio = () => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: '/' }))
  }

  return (
    <div className="finished" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'var(--background)',
      inset: 0,
      position: 'absolute',
      zIndex: 1000
    }}>
      <div className="finished-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary)', fontSize: '4rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, fontFamily: 'var(--font-heading)' }}>
          Race Completed!
        </h1>
        <p style={{ color: 'var(--text-primary)', fontSize: '2rem', marginTop: '1.5rem', fontWeight: '600', letterSpacing: '0.05em', fontFamily: 'var(--font-body)' }}>
          Your time: <span style={{ color: 'var(--primary)' }}>{readableTime(time)}</span> seconds
        </p>
      </div>
      
      <div className="finished-actions" style={{ display: 'flex', gap: '20px', marginTop: '40px', justifyContent: 'center' }}>
        <button 
          onClick={restartRun}
          style={{ 
            backgroundColor: 'transparent', 
            color: 'var(--text-primary)', 
            border: '2px solid var(--text-primary)', 
            padding: '16px 32px', 
            fontSize: '1.2rem', 
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            borderRadius: '4px',
            fontFamily: 'var(--font-body)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--background)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-primary)'; }}
        >
          Race Again
        </button>
        <button 
          onClick={returnToPortfolio}
          style={{ 
            backgroundColor: 'var(--primary)', 
            color: '#ffffff', 
            border: '2px solid var(--primary)', 
            padding: '16px 32px', 
            fontSize: '1.2rem', 
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            borderRadius: '4px',
            fontFamily: 'var(--font-body)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-hover)'; e.currentTarget.style.borderColor = 'var(--primary-hover)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
        >
          Return to Portfolio
        </button>
      </div>
    </div>
  )
}
