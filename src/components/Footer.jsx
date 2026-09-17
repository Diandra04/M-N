import React from 'react';
import { Heart } from 'lucide-react';

export function Footer({ couple }) {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      padding: '3.5rem 0 2.5rem 0',
      background: 'var(--bg-card)',
      marginTop: '4rem'
    }} className="no-print">
      <div className="container" style={{ textAlign: 'center' }}>
        
        {/* Main Title */}
        <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', marginBottom: '0.4rem', fontWeight: 300 }}>
          {couple.partner1} & {couple.partner2}
        </h3>

        {/* Diandra's Gift Message */}
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          color: 'var(--text-secondary)',
          fontSize: '1.15rem',
          maxWidth: '560px',
          margin: '0.5rem auto 1.5rem auto',
          lineHeight: 1.5
        }}>
          "A gift from Diandra — I hope it is helpful"
        </p>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
          Created with <Heart size={12} style={{ display: 'inline', margin: '0 2px', color: '#ff4d4d' }} /> for {couple.partner1} & {couple.partner2} • Civil Wedding Celebration
        </div>

      </div>
    </footer>
  );
}
