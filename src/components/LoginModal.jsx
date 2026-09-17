import React, { useState, useEffect } from 'react';
import { X, KeyRound, ShieldCheck } from 'lucide-react';

export function LoginModal({ isOpen, onClose, onLogin, onUpdatePin, currentUser, auth, initialRole = 'MANZI' }) {
  const [selectedRole, setSelectedRole] = useState(initialRole || 'MANZI');
  const [mode, setMode] = useState('ENTER_PIN'); // 'ENTER_PIN' | 'CHANGE_PIN'
  const [pinInput, setPinInput] = useState('');
  const [oldPinInput, setOldPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sync selectedRole when modal opens with initialRole
  useEffect(() => {
    if (isOpen) {
      if (currentUser === 'MANZI' || currentUser === 'NIKITA') {
        setSelectedRole(currentUser);
      } else if (initialRole) {
        setSelectedRole(initialRole);
      }
      setPinInput('');
      setOldPinInput('');
      setNewPinInput('');
      setErrorMsg('');
      setSuccessMsg('');
      setMode('ENTER_PIN');
    }
  }, [isOpen, initialRole, currentUser]);

  if (!isOpen) return null;

  const isManzi = selectedRole === 'MANZI';
  const userName = isManzi ? 'Manzi' : 'Nikita';
  const currentPin = isManzi ? (auth?.manziPin || '1234') : (auth?.nikitaPin || '5678');
  const primaryColor = isManzi ? '#8B5E3C' : '#E08298';

  // Handle number click on virtual keypad
  const handleKeyClick = (num) => {
    setErrorMsg('');
    if (mode === 'ENTER_PIN') {
      if (pinInput.length < 4) {
        const updated = pinInput + num;
        setPinInput(updated);
        if (updated.length === 4) {
          verifyAndLogin(updated);
        }
      }
    }
  };

  const handleBackspace = () => {
    setErrorMsg('');
    if (mode === 'ENTER_PIN') {
      setPinInput(prev => prev.slice(0, -1));
    }
  };

  const verifyAndLogin = (enteredPin) => {
    if (enteredPin === currentPin) {
      setSuccessMsg(`Welcome, ${userName}! Vault Unlocked.`);
      setTimeout(() => {
        onLogin(selectedRole);
        onClose();
      }, 350);
    } else {
      setErrorMsg(`Incorrect PIN for ${userName}. Default PIN: ${currentPin}`);
      setPinInput('');
    }
  };

  const handleSaveNewPin = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (oldPinInput !== currentPin) {
      setErrorMsg('Current PIN is incorrect.');
      return;
    }
    if (newPinInput.length !== 4 || !/^\d{4}$/.exec(newPinInput)) {
      setErrorMsg('New PIN must be exactly 4 digits.');
      return;
    }

    if (onUpdatePin) {
      onUpdatePin(selectedRole, newPinInput);
      setSuccessMsg(`New 4-digit PIN set for ${userName}!`);
      setTimeout(() => {
        setMode('ENTER_PIN');
        setPinInput('');
      }, 1000);
    }
  };

  const handleSwitchUser = () => {
    const target = selectedRole === 'MANZI' ? 'NIKITA' : 'MANZI';
    setSelectedRole(target);
    setPinInput('');
    setErrorMsg('');
    setSuccessMsg('');
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
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: `${primaryColor}15`,
              color: primaryColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <KeyRound size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, color: '#000000', margin: 0 }}>
                Unlock Secret Vows
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.1rem 0 0 0' }}>
                4-Digit Private Passcode
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.35rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* SINGLE USER BADGE & USER SWITCHER (NO SIDE-BY-SIDE BOTH BUTTONS) */}
        <div style={{ 
          background: `${primaryColor}10`,
          border: `1px solid ${primaryColor}30`,
          borderRadius: '16px',
          padding: '0.85rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: primaryColor, fontWeight: 700 }}>
              Profile Account
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: primaryColor, marginTop: '0.1rem' }}>
              {userName}'s Vault
            </div>
          </div>

          <button
            type="button"
            onClick={handleSwitchUser}
            style={{
              background: '#ffffff',
              color: primaryColor,
              border: `1px solid ${primaryColor}40`,
              borderRadius: '20px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Switch to {isManzi ? 'Nikita' : 'Manzi'}
          </button>
        </div>

        {/* MODE TABS: Enter PIN vs Change PIN */}
        <div style={{ display: 'flex', borderBottom: '1px solid #eeeeee', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setMode('ENTER_PIN')}
            style={{
              flex: 1,
              padding: '0.5rem',
              background: 'none',
              border: 'none',
              borderBottom: mode === 'ENTER_PIN' ? `2px solid ${primaryColor}` : '2px solid transparent',
              color: mode === 'ENTER_PIN' ? primaryColor : '#888888',
              fontWeight: mode === 'ENTER_PIN' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Enter PIN
          </button>
          <button
            type="button"
            onClick={() => setMode('CHANGE_PIN')}
            style={{
              flex: 1,
              padding: '0.5rem',
              background: 'none',
              border: 'none',
              borderBottom: mode === 'CHANGE_PIN' ? `2px solid ${primaryColor}` : '2px solid transparent',
              color: mode === 'CHANGE_PIN' ? primaryColor : '#888888',
              fontWeight: mode === 'CHANGE_PIN' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Set Custom PIN
          </button>
        </div>

        {/* FEEDBACK MESSAGES */}
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

        {successMsg && (
          <div style={{
            background: '#F0FFF4',
            color: '#2F855A',
            border: '1px solid #9AE6B4',
            padding: '0.6rem 0.85rem',
            borderRadius: '10px',
            fontSize: '0.8rem',
            marginBottom: '1rem',
            textAlign: 'center',
            fontWeight: 600
          }}>
            {successMsg}
          </div>
        )}

        {/* MODE 1: ENTER PIN KEYPAD */}
        {mode === 'ENTER_PIN' && (
          <div>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#666666', marginBottom: '1.25rem' }}>
              Enter 4-digit PIN for <strong>{userName}</strong>
            </p>

            {/* 4-DOT PIN DISPLAY */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
              {[0, 1, 2, 3].map((idx) => {
                const isFilled = pinInput.length > idx;
                return (
                  <div
                    key={idx}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: isFilled ? primaryColor : 'transparent',
                      border: `2px solid ${isFilled ? primaryColor : '#cccccc'}`,
                      transition: 'all 0.2s ease',
                      transform: isFilled ? 'scale(1.15)' : 'scale(1)'
                    }}
                  />
                );
              })}
            </div>

            {/* 3x4 VIRTUAL NUMERIC KEYPAD */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              maxWidth: '280px',
              margin: '0 auto 1rem auto'
            }}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeyClick(num)}
                  style={{
                    height: '52px',
                    borderRadius: '50%',
                    border: '1px solid #e5e5e7',
                    background: '#fcfcfd',
                    color: '#1d1d1f',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {num}
                </button>
              ))}
              <div />
              <button
                type="button"
                onClick={() => handleKeyClick('0')}
                style={{
                  height: '52px',
                  borderRadius: '50%',
                  border: '1px solid #e5e5e7',
                  background: '#fcfcfd',
                  color: '#1d1d1f',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                }}
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                style={{
                  height: '52px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'transparent',
                  color: '#666666',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ⌫
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Default PIN for {userName}: <strong>{currentPin}</strong>
              </span>
            </div>
          </div>
        )}

        {/* MODE 2: CHANGE / CREATE CUSTOM PIN */}
        {mode === 'CHANGE_PIN' && (
          <form onSubmit={handleSaveNewPin} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem', color: '#555555' }}>
                Current PIN for {userName}
              </label>
              <input
                type="password"
                maxLength={4}
                value={oldPinInput}
                onChange={(e) => setOldPinInput(e.target.value)}
                placeholder="Enter current 4-digit PIN"
                className="form-input"
                style={{ padding: '0.65rem 0.9rem', fontSize: '0.95rem', borderRadius: '10px' }}
                required
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.75rem', color: '#555555' }}>
                New 4-Digit PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                placeholder="e.g. 1015"
                className="form-input"
                style={{ padding: '0.65rem 0.9rem', fontSize: '0.95rem', borderRadius: '10px' }}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                background: primaryColor,
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: '0.4rem',
                boxShadow: `0 4px 14px ${primaryColor}40`
              }}
            >
              Save Custom PIN
            </button>
          </form>
        )}

        {/* LOCK FOOTER INFO */}
        <div style={{
          marginTop: '1.25rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          fontSize: '0.75rem',
          color: '#888888'
        }}>
          <ShieldCheck size={14} style={{ color: '#34A853' }} />
          <span>Session remains active until locked</span>
        </div>

      </div>
    </div>
  );
}
