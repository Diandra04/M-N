import React, { useState } from 'react';
import { 
  Plus, Trash2, Edit, RotateCcw, Clock, MapPin, CheckCircle2, FileText 
} from 'lucide-react';

export function ItineraryPlanner({ 
  events = [], 
  dayTitles = {},
  onUpdateDayTitle,
  onToggleComplete, 
  onDeleteEvent, 
  onOpenAddModal, 
  onEditEvent
}) {
  const [flippedIds, setFlippedIds] = useState(new Set());

  // Group events chronologically by date
  const groupedDateRanks = events.reduce((acc, evt) => {
    const key = evt.date || '2026-10-15';
    if (!acc[key]) {
      acc[key] = {
        date: key,
        dayLabel: evt.dayLabel || key,
        events: []
      };
    }
    acc[key].events.push(evt);
    return acc;
  }, {});

  const dateRankKeys = Object.keys(groupedDateRanks).sort();

  const getDateRankTitle = (dateKey, label) => {
    const cleanLabel = (label || '').replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();

    const custom = dayTitles && dayTitles[dateKey];
    if (custom !== undefined && custom !== null && custom !== '') {
      return `${cleanLabel} — ${custom}`;
    }

    if (dateKey === '2026-10-10') return `${cleanLabel} — Traditional Irembo Day`;
    if (dateKey === '2026-10-13') return `${cleanLabel} — Beauty Prep & Nails Day`;
    if (dateKey === '2026-10-14') return `${cleanLabel} — Hair Styling & Toronto Roadtrip Drive`;
    if (dateKey === '2026-10-15') return `${cleanLabel} — Civil Ceremony, Resto Dinner & Night Club`;
    if (dateKey === '2026-10-16') return `${cleanLabel} — The Morning After (Brunch) & Family Dinner`;
    if (dateKey === '2026-10-17') return `${cleanLabel} — Airbnb Checkout & Departure`;
    return cleanLabel;
  };

  const toggleFlip = (id) => {
    setFlippedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section id="itinerary" style={{
      paddingTop: '4rem',
      paddingBottom: '5rem',
      backgroundColor: '#ffffff',
      color: '#111111',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div className="container" style={{ width: '100%', boxSizing: 'border-box' }}>
        
        {/* Section Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '1.75rem',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          paddingBottom: '1.25rem'
        }}>
          <div>
            <h2 style={{ fontSize: '2.6rem', fontFamily: 'var(--font-serif)', fontStyle: 'normal', fontWeight: 600, color: '#111111', marginBottom: '0.4rem' }}>
              M&N Civil Planner
            </h2>
            <p style={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '0.95rem', maxWidth: '600px', margin: 0 }}>
              Organized chronologically by day ranks. Tap any photo card to flip for notes!
            </p>
          </div>

          {/* Action Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }} className="no-print">
            <button
              onClick={() => {
                const vault = document.getElementById('vault');
                if (vault) vault.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-outline btn-sm"
              style={{ padding: '0.6rem 1.2rem', borderRadius: '25px', fontSize: '0.85rem', fontWeight: 700, borderColor: '#111111', color: '#111111' }}
            >
              <FileText size={15} />
              <span>Apple Notes &amp; Tasks</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="btn-primary btn-sm"
              style={{ background: '#111111', color: '#ffffff', border: 'none', fontWeight: 700, padding: '0.6rem 1.35rem', borderRadius: '25px', fontSize: '0.85rem' }}
            >
              <Plus size={16} />
              <span>Add Custom Event</span>
            </button>
          </div>
        </div>

        {/* MINIMALIST ROADLINE TIMELINE CONTAINER */}
        <div style={{ position: 'relative' }}>

          {events.length === 0 ? (
            <div style={{
              padding: '3rem',
              textAlign: 'center',
              color: 'rgba(0,0,0,0.6)',
              border: '1px dashed rgba(0,0,0,0.2)',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.8)'
            }}>
              No events listed for this date yet. Click "Add Custom Event" to create one!
            </div>
          ) : (
            dateRankKeys.map((dateKey) => {
              const rankGroup = groupedDateRanks[dateKey];

              return (
                <div 
                  key={dateKey} 
                  style={{ 
                    marginBottom: '3.5rem',
                    position: 'relative',
                    paddingLeft: '1.75rem'
                  }}
                >
                  {/* Dynamic Animated Black & White Highway Road Track */}
                  <div className="bw-road-track" />

                  {/* Creative Black & White Waypoint Node */}
                  <div className="bw-day-node" />

                  {/* VINTAGE WRITING DAY RANK HEADER WITH MINIMALIST EDIT ICON */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                    <h3 style={{
                      fontSize: '2.1rem',
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      color: '#111111',
                      margin: 0,
                      lineHeight: 1.2,
                      letterSpacing: '0.01em'
                    }}>
                      {getDateRankTitle(dateKey, rankGroup.dayLabel)}
                    </h3>

                    {onUpdateDayTitle && (
                      <button
                        onClick={() => {
                          const current = (dayTitles && dayTitles[dateKey]) || '';
                          const input = prompt(`Edit Subtitle for ${rankGroup.dayLabel}:`, current);
                          if (input !== null) {
                            onUpdateDayTitle(dateKey, input.trim());
                          }
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'rgba(0, 0, 0, 0.4)',
                          padding: '0.35rem',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.color = '#111111'; e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = 'rgba(0, 0, 0, 0.4)'; e.currentTarget.style.background = 'transparent'; }}
                        title="Edit Date Subtitle"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                  </div>

                  {/* EVENT CARDS GRID CONNECTED TO ROADLINE */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                    gap: '1.75rem',
                    alignItems: 'start'
                  }}>
                    {rankGroup.events.map((evt) => {
                      const isFlipped = flippedIds.has(evt.id);

                      return (
                        <div key={evt.id} style={{ position: 'relative' }}>
                          {/* Dynamic Black & White Horizontal Connector, Junction Dot & Card Diamond Node */}
                          <div className="bw-connector-line" />
                          <div className="bw-connector-dot" />
                          <div className="bw-card-diamond" />
                          
                          {/* 3D FLIP CARD CONTAINER */}
                          <div 
                            className={`flip-card-container ${isFlipped ? 'flipped' : ''}`}
                            style={{ minHeight: '340px' }}
                          >
                            <div className="flip-card-inner">
                              
                              {/* FRONT SIDE (SQUARE IMAGE + EDITORIAL DATE & CATCHY NAME) */}
                              <div 
                                className="flip-card-front glass-card"
                                onClick={() => toggleFlip(evt.id)}
                                style={{
                                  background: 'var(--bg-card)',
                                  opacity: 1,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  padding: 0,
                                  borderRadius: '10px',
                                  border: '1px solid var(--border-color)',
                                  overflow: 'hidden'
                                }}
                              >
                                {/* Square Image Banner */}
                                <div style={{
                                  position: 'relative',
                                  width: '100%',
                                  aspectRatio: '1 / 1',
                                  overflow: 'hidden',
                                  background: '#111111'
                                }}>
                                  {evt.image ? (
                                    <img 
                                      src={evt.image} 
                                      alt={evt.title} 
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                      className="event-card-img"
                                    />
                                  ) : (
                                    <div style={{
                                      height: '100%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      background: 'linear-gradient(135deg, #111 0%, #333 100%)',
                                      color: '#ffffff',
                                      fontFamily: 'var(--font-serif)',
                                      fontSize: '1.2rem',
                                      padding: '1rem',
                                      textAlign: 'center'
                                    }}>
                                      {evt.title}
                                    </div>
                                  )}

                                  {/* High-End Editorial Date & Time Overlay */}
                                  <div style={{
                                    position: 'absolute',
                                    top: '0.85rem',
                                    left: '0.85rem',
                                    zIndex: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    background: 'rgba(0, 0, 0, 0.55)',
                                    backdropFilter: 'blur(12px)',
                                    WebkitBackdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255, 255, 255, 0.22)',
                                    borderRadius: '8px',
                                    padding: '0.4rem 0.75rem',
                                    color: '#ffffff',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
                                  }}>
                                    <span style={{
                                      fontFamily: 'var(--font-display)',
                                      fontSize: '1.12rem',
                                      fontWeight: 600,
                                      letterSpacing: '0.14em',
                                      textTransform: 'uppercase',
                                      lineHeight: 1
                                    }}>
                                      {evt.dayLabel && evt.dayLabel.includes(',') 
                                        ? evt.dayLabel.split(',')[1].trim() 
                                        : evt.dayLabel || evt.date}
                                    </span>
                                    <span style={{
                                      fontSize: '0.78rem',
                                      fontWeight: 600,
                                      opacity: 0.9,
                                      marginTop: '0.15rem',
                                      letterSpacing: '0.08em'
                                    }}>
                                      {evt.time}
                                    </span>
                                  </div>

                                  {/* Direct Edit Button Overlay (Front side) */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (onEditEvent) onEditEvent(evt);
                                    }}
                                    style={{
                                      position: 'absolute',
                                      top: '0.85rem',
                                      right: '0.85rem',
                                      zIndex: 3,
                                      background: 'rgba(0, 0, 0, 0.65)',
                                      backdropFilter: 'blur(10px)',
                                      WebkitBackdropFilter: 'blur(10px)',
                                      border: '1px solid rgba(255, 255, 255, 0.3)',
                                      color: '#ffffff',
                                      width: '32px',
                                      height: '32px',
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                      transition: 'all 0.2s ease'
                                    }}
                                    title="Quick Edit Event"
                                  >
                                    <Edit size={14} />
                                  </button>

                                  {/* Catchy Main Event Title Banner */}
                                  <div style={{
                                    position: 'absolute',
                                    bottom: '0.85rem',
                                    left: '0.85rem',
                                    right: '0.85rem',
                                    zIndex: 2,
                                    background: 'rgba(0, 0, 0, 0.65)',
                                    backdropFilter: 'blur(14px)',
                                    WebkitBackdropFilter: 'blur(14px)',
                                    border: '1px solid rgba(255, 255, 255, 0.22)',
                                    borderRadius: '8px',
                                    padding: '0.65rem 0.85rem',
                                    color: '#ffffff',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                                  }}>
                                    <div style={{
                                      fontFamily: 'var(--font-serif)',
                                      fontSize: '1.25rem',
                                      fontWeight: 600,
                                      lineHeight: 1.2,
                                      letterSpacing: '0.01em',
                                      color: '#ffffff'
                                    }}>
                                      {evt.title}
                                    </div>
                                    {evt.location && (
                                      <div style={{
                                        fontSize: '0.75rem',
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        marginTop: '0.2rem',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                      }}>
                                        {evt.location}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* BACK SIDE (DETAILS, NOTES, EDIT & DELETE ACTIONS) */}
                              <div 
                                className="flip-card-back glass-card"
                                style={{
                                  background: 'var(--bg-card)',
                                  borderRadius: '10px',
                                  border: '1px solid var(--border-color)',
                                  padding: 0,
                                  overflow: 'hidden'
                                }}
                              >
                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                  
                                  <div style={{ padding: '1.25rem', flex: 1, overflowY: 'auto' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                      <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                                        Event Dossier
                                      </span>
                                      <button
                                        onClick={() => toggleFlip(evt.id)}
                                        className="btn-outline btn-sm"
                                        style={{ padding: '0.15rem 0.5rem', fontSize: '0.72rem' }}
                                      >
                                        <RotateCcw size={12} /> Flip Back
                                      </button>
                                    </div>

                                    <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-serif)', fontWeight: 600, marginBottom: '0.65rem', lineHeight: 1.25 }}>
                                      {evt.title}
                                    </h3>

                                    {/* Main Info: Time & Location */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                        <Clock size={14} />
                                        <span>{evt.dayLabel} @ {evt.time}</span>
                                      </div>

                                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                                        <MapPin size={14} style={{ marginTop: '0.15rem', flexShrink: 0, color: 'var(--text-primary)' }} />
                                        <span style={{ lineHeight: 1.3 }}>{evt.location}</span>
                                      </div>
                                    </div>

                                    {/* Main Info: Notes Description */}
                                    {evt.notes && (
                                      <div style={{
                                        fontSize: '0.82rem',
                                        color: 'var(--text-secondary)',
                                        background: 'var(--bg-input)',
                                        padding: '0.65rem 0.8rem',
                                        borderRadius: '8px',
                                        borderLeft: '3px solid var(--text-primary)',
                                        lineHeight: 1.45,
                                        marginBottom: '0.85rem'
                                      }}>
                                        {evt.notes}
                                      </div>
                                    )}
                                  </div>

                                  {/* Bottom Completion Checkbox & Direct Action Buttons */}
                                  <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.02)' }}>
                                    <button
                                      onClick={() => onToggleComplete(evt.id)}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.82rem',
                                        color: evt.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                                        fontWeight: 600
                                      }}
                                    >
                                      <div className={`custom-checkbox ${evt.completed ? 'checked' : ''}`}>
                                        {evt.completed && <CheckCircle2 size={14} />}
                                      </div>
                                      <span>{evt.completed ? 'Marked Completed' : 'Mark Event Completed'}</span>
                                    </button>

                                    {/* Direct Edit & Delete Actions */}
                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.6rem',
                                      marginTop: '0.6rem',
                                      paddingTop: '0.5rem',
                                      borderTop: '1px dashed var(--border-color)'
                                    }} className="no-print">
                                      <button
                                        onClick={() => { if (onEditEvent) onEditEvent(evt); }}
                                        className="btn-outline btn-sm"
                                        style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                                      >
                                        <Edit size={12} /> Edit Event
                                      </button>

                                      <button
                                        onClick={() => onDeleteEvent(evt.id)}
                                        className="btn-outline btn-sm"
                                        style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem', color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)', fontWeight: 700 }}
                                      >
                                        <Trash2 size={12} /> Delete
                                      </button>
                                    </div>
                                  </div>

                                </div>

                              </div>

                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
