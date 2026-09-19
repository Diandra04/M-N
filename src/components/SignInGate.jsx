import React, { useState } from 'react';
import { LogIn, ShieldCheck } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { getRoleForEmail } from '../services/googleAuth';

export function SignInGate() {
  const [errorMsg, setErrorMsg] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsSigningIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const role = getRoleForEmail(result.user.email);

      if (!role) {
        await auth.signOut();
        setErrorMsg(`"${result.user.email}" isn't linked to this planner.`);
        setIsSigningIn(false);
        return;
      }
      // App.jsx picks up the signed-in user via onAuthStateChanged from here
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setErrorMsg('Sign-in failed. Please try again.');
      }
      setIsSigningIn(false);
    }
  };

  return (
    <section className="signin-gate" style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      boxSizing: 'border-box',
      color: '#ffffff',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '420px', width: '100%' }}>
        <div style={{ fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
          Civil Wedding Celebration
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(2.6rem, 7vw, 4rem)', margin: '0 0 2.5rem 0', textShadow: '0 4px 24px rgba(0,0,0,0.85)' }}>
          M&amp;N Planner
        </h1>

        {errorMsg && (
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#ffffff',
            padding: '0.65rem 1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.7rem 1.5rem',
            borderRadius: '999px',
            border: 'none',
            background: '#ffffff',
            color: '#111111',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: isSigningIn ? 'default' : 'pointer',
            opacity: isSigningIn ? 0.7 : 1,
            boxShadow: '0 8px 30px rgba(0,0,0,0.45)',
            transition: 'opacity 0.2s ease'
          }}
        >
          <LogIn size={16} />
          {isSigningIn ? 'Signing in…' : 'Sign In with Google'}
        </button>

        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
          <ShieldCheck size={14} />
          <span>Only Manzi &amp; Nikita's own accounts can access this planner</span>
        </div>
      </div>
    </section>
  );
}
