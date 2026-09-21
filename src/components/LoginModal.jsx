import React, { useState } from 'react';
import { X, ShieldCheck, LogIn } from 'lucide-react';

export function LoginModal({ isOpen, onClose, errorMsg, onSignIn }) {
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    // Navigates away to Google and back; App.jsx picks up the result via
    // getRedirectResult/onAuthStateChanged once the browser returns here.
    await onSignIn();
    setIsSigningIn(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ backdropFilter: 'blur(10px)' }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '400px',
          borderRadius: '24px',
          padding: '2rem 1.75rem',
          background: '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(0,0,0,0.08)'
        }}
      >

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, color: '#000000', margin: 0 }}>
              Unlock Secret Vows
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.1rem 0 0 0' }}>
              Sign in with your Google account
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn" style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#666666', marginBottom: '1.5rem' }}>
          Only Manzi & Nikita's own Google accounts can unlock their private vows and vault. Signing in works from any device.
        </p>

        {errorMsg && (
          <div style={{
            background: '#FFF5F5',
            color: '#E53E3E',
            border: '1px solid #FEB2B2',
            padding: '0.6rem 0.85rem',
            borderRadius: '10px',
            fontSize: '0.8rem',
            marginBottom: '1rem',
            textAlign: 'center',
            fontWeight: 500
          }}>
            {errorMsg}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0 1rem 0' }}>
          <button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              width: '100%',
              justifyContent: 'center',
              padding: '0.75rem 1.5rem',
              borderRadius: '30px',
              border: '1px solid #dadce0',
              background: '#ffffff',
              color: '#3c4043',
              fontSize: '0.92rem',
              fontWeight: 600,
              cursor: isSigningIn ? 'default' : 'pointer',
              opacity: isSigningIn ? 0.6 : 1
            }}
          >
            <LogIn size={18} />
            {isSigningIn ? 'Signing in…' : 'Sign in with Google'}
          </button>
        </div>

        <div style={{
          marginTop: '1.25rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: '0.25rem',
          fontSize: '0.75rem',
          color: '#888888'
        }}>
          <ShieldCheck size={14} style={{ color: '#34A853', flexShrink: 0, marginTop: '0.15rem' }} />
          <span>Stays signed in on this device until you sign out</span>
        </div>

      </div>
    </div>
  );
}
