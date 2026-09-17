import React from 'react';
import { UserCheck } from 'lucide-react';

export function Navbar({ 
  couple, 
  currentUser,
  onOpenLoginModal
}) {
  const isManzi = currentUser === 'MANZI';
  const isNikita = currentUser === 'NIKITA';

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      background: 'rgba(255, 255, 255, 0.95)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.85rem 0'
    }} className="no-print">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'normal', fontSize: '1.4rem', fontWeight: 600, lineHeight: 1.1, color: '#000000', letterSpacing: '0.01em' }}>
            {couple?.partner1 || 'Manzi'} & {couple?.partner2 || 'Nikita'}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.1rem' }}>
            Civil Wedding Celebration
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onOpenLoginModal(isManzi ? 'NIKITA' : 'MANZI')}
            style={{ 
              background: isManzi ? '#8B5E3C' : isNikita ? '#E08298' : 'transparent',
              color: isManzi || isNikita ? '#ffffff' : 'var(--text-primary)',
              border: isManzi || isNikita ? 'none' : '1px solid var(--border-color)',
              padding: '0.45rem 1.1rem',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.25s ease'
            }}
            title="Click to switch profile"
          >
            <UserCheck size={14} />
            <span>{isManzi ? 'Manzi' : isNikita ? 'Nikita' : 'Sign In'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
