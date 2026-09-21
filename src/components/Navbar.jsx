import React from 'react';
import { UserCheck, LogOut } from 'lucide-react';

export function Navbar({
  couple,
  currentUser,
  onOpenLoginModal,
  onLogout
}) {
  const isManzi = currentUser === 'MANZI';
  const isNikita = currentUser === 'NIKITA';
  const isSignedIn = isManzi || isNikita;
  const roleColor = isManzi ? '#8B5E3C' : '#E08298';

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
          {isSignedIn ? (
            <>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.9rem 0.4rem 0.6rem',
                borderRadius: '20px',
                background: 'var(--badge-bg)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: roleColor
                }} />
                {isManzi ? 'Manzi' : 'Nikita'}
              </span>
              <button
                onClick={onLogout}
                title="Sign out"
                aria-label="Sign out"
                style={{
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-color)',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-active)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <button
              onClick={onOpenLoginModal}
              style={{
                background: 'transparent',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
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
            >
              <UserCheck size={14} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
