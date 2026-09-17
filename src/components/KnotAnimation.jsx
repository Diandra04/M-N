import React from 'react';

export function KnotAnimation() {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        margin: '1.2rem 0',
        position: 'relative',
        width: '100%',
        maxWidth: '360px'
      }}
    >
      <div 
        style={{
          position: 'relative',
          width: '100%',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 320 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'visible' }}
        >
          {/* Symmetrical Guide Shadow Track */}
          <path
            d="M 160,50 C 110,15 60,15 60,50 C 60,85 110,85 160,50 C 210,15 260,15 260,50 C 260,85 210,85 160,50 Z"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* CORD 1: Perfectly Symmetrical Infinity Flowing Line */}
          <path
            d="M 160,50 C 110,15 60,15 60,50 C 60,85 110,85 160,50 C 210,15 260,15 260,50 C 260,85 210,85 160,50 Z"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            className="symmetrical-infinity-1"
          />

          {/* CORD 2: Interlocking Dashed Line */}
          <path
            d="M 160,50 C 210,85 260,85 260,50 C 260,15 210,15 160,50 C 110,85 60,85 60,50 C 60,15 110,15 160,50 Z"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeDasharray="6 5"
            strokeLinecap="round"
            className="symmetrical-infinity-2"
          />

          {/* Center Knot Intersection Lock Pin & Halo */}
          <circle cx="160" cy="50" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3 3" className="symmetrical-knot-halo" />
          <circle cx="160" cy="50" r="5" fill="#ffffff" className="symmetrical-knot-center" />
        </svg>
      </div>

      {/* Elegant Subtitle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        marginTop: '0.4rem',
        fontSize: '0.82rem',
        color: 'rgba(255,255,255,0.85)',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-serif)',
        fontWeight: '500'
      }}>
        <span style={{ display: 'inline-block', width: '20px', height: '1px', background: 'rgba(255,255,255,0.4)' }}></span>
        <span>Tying the Knot</span>
        <span style={{ display: 'inline-block', width: '20px', height: '1px', background: 'rgba(255,255,255,0.4)' }}></span>
      </div>

      <style>{`
        .symmetrical-infinity-1 {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: flowSymmetrical1 7s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }

        .symmetrical-infinity-2 {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: flowSymmetrical2 7s cubic-bezier(0.45, 0.05, 0.55, 0.95) 0.5s infinite;
        }

        .symmetrical-knot-center {
          transform-origin: 160px 50px;
          animation: comeAndBreatheDot 3s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 10px #ffffff);
        }

        .symmetrical-knot-halo {
          transform-origin: 160px 50px;
          animation: rotateHalo 14s linear infinite;
        }

        @keyframes flowSymmetrical1 {
          0% { stroke-dashoffset: 600; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes flowSymmetrical2 {
          0% { stroke-dashoffset: 600; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes comeAndBreatheDot {
          0% { opacity: 0.3; transform: scale(0.6); }
          50% { opacity: 1; transform: scale(1.25); filter: drop-shadow(0 0 14px #ffffff); }
          100% { opacity: 0.85; transform: scale(1); filter: drop-shadow(0 0 8px #ffffff); }
        }

        @keyframes rotateHalo {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
