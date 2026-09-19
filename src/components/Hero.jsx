import React, { useState, useEffect } from 'react';
import { KnotAnimation } from './KnotAnimation';

const CIVIL_WEDDING_DATE = new Date(2026, 9, 15, 12, 30, 0); // October 15, 2026 at 12:30 PM

function getTimeLeft() {
  const diff = CIVIL_WEDDING_DATE.getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Hero({ couple }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section" style={{
      position: 'relative',
      minHeight: '88vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '3rem 0',
      backgroundImage: `linear-gradient(to bottom, rgba(5,5,7,0.7), rgba(5,5,7,0.88)), url('/images/backgroungImage.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: '#ffffff',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div className="hero-countdown-badge">
        <span className="hero-day-number" style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(6rem, 12vw, 10.5rem)',
          fontWeight: '300', 
          lineHeight: 0.8, 
          color: '#ffffff',
          letterSpacing: '-0.04em',
          textShadow: '0 6px 32px rgba(0,0,0,0.95)'
        }}>
          {timeLeft.days}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#ffffff', lineHeight: 1.1, textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}>
            DAYS TO GO
          </span>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '0.3rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
            marginTop: '0.2rem'
          }}>
            <span>{String(timeLeft.hours).padStart(2, '0')}H</span>
            <span style={{ opacity: 0.6 }}>:</span>
            <span>{String(timeLeft.minutes).padStart(2, '0')}M</span>
            <span style={{ opacity: 0.6 }}>:</span>
            <span>{String(timeLeft.seconds).padStart(2, '0')}S</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ maxWidth: '850px' }}>
          <h1 style={{
            fontSize: 'clamp(3rem, 7vw, 5.2rem)',
            lineHeight: 1.05,
            marginBottom: '0.5rem',
            fontFamily: 'var(--font-serif)',
            fontWeight: 300,
            letterSpacing: '0.01em',
            textShadow: '0 2px 20px rgba(0,0,0,0.8)'
          }}>
            {couple?.partner1 || 'Manzi'} & {couple?.partner2 || 'Nikita'}
          </h1>

          <div style={{ margin: '1rem 0 1.5rem 0', maxWidth: '680px' }}>
            <blockquote style={{
              fontSize: '1.25rem',
              color: 'rgba(255,255,255,0.95)',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              lineHeight: 1.5,
              borderLeft: '2px solid rgba(255,255,255,0.6)',
              paddingLeft: '1.1rem',
              marginBottom: '1rem',
              textShadow: '0 2px 14px rgba(0,0,0,0.9)'
            }}>
              “What began as a simple conversation, ended in love.”
              <footer style={{
                fontSize: '0.85rem',
                fontStyle: 'normal',
                color: 'rgba(255,255,255,0.75)',
                marginTop: '0.4rem',
                letterSpacing: '0.05em'
              }}>
                ― Mark Anthony
              </footer>
            </blockquote>

            <blockquote style={{
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.85)',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              lineHeight: 1.5,
              borderLeft: '2px solid rgba(255,255,255,0.4)',
              paddingLeft: '1.1rem',
              marginBottom: '1rem',
              textShadow: '0 2px 14px rgba(0,0,0,0.9)'
            }}>
              “You are the best surprise of my life.”
              <footer style={{
                fontSize: '0.78rem',
                fontStyle: 'normal',
                color: 'rgba(255,255,255,0.65)',
                marginTop: '0.4rem',
                letterSpacing: '0.05em'
              }}>
                ― Poets Love Her
              </footer>
            </blockquote>

            <div style={{
              fontSize: 'clamp(1.8rem, 4.2vw, 3rem)',
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              color: '#ffffff',
              marginTop: '1.2rem',
              letterSpacing: '0.02em',
              textShadow: '0 4px 20px rgba(0,0,0,0.95)'
            }}>
              I can't wait to marry you
            </div>
          </div>

          <div style={{ margin: '1rem 0 2rem 0', maxWidth: '520px', width: '100%' }}>
            <KnotAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}
