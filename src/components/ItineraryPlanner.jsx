import React, { useState } from 'react';
import {
  Plus, Trash2, Edit, RotateCcw, Clock, MapPin, CheckCircle2, AlertTriangle, ChevronDown, ChevronsDownUp, ChevronsUpDown
} from 'lucide-react';

export function ItineraryPlanner({
  events = [],
  dayTitles = {},
  currentUser,
  onUpdateDayTitle,
  onToggleComplete,
  onDeleteEvent,
  onOpenAddModal,
  onEditEvent
}) {
  const [flippedIds, setFlippedIds] = useState(new Set());
  const [personFilter, setPersonFilter] = useState('ALL'); // 'ALL' | 'NIKITA' | 'MANZI' | 'BOTH'
  // only Manzi/Nikita can write to Firestore, so hide edit controls for anyone else
  const canEdit = currentUser === 'MANZI' || currentUser === 'NIKITA';

  const getEventPerson = (evt) => {
    if (evt.forWho) return evt.forWho;
    const title = (evt.title || '').toLowerCase();
    const notes = (evt.notes || '').toLowerCase();
    if (title.includes('nikita') || title.includes('nail') || title.includes('hair') || title.includes('makeup') || notes.includes('nikita')) {
      return 'NIKITA';
    }
    if (title.includes('manzi') || title.includes('suit') || title.includes('barber') || title.includes('groom') || notes.includes('manzi')) {
      return 'MANZI';
    }
    return 'BOTH';
  };

  const isDateInPast = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(`${dateStr}T00:00:00`);
    return target < today;
  };

  const filteredEvents = events.filter(evt => {
    if (personFilter === 'ALL') return true;
    return getEventPerson(evt) === personFilter;
  });

  const groupedDateRanks = filteredEvents.reduce((acc, evt) => {
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

  // Days collapse by default so the page doesn't grow endlessly as more
  // events get added — only the nearest upcoming (or most recent) day
  // opens automatically.
  const [expandedDays, setExpandedDays] = useState(() => {
    const upcoming = dateRankKeys.find(k => !isDateInPast(k));
    const defaultKey = upcoming || dateRankKeys[dateRankKeys.length - 1];
    return defaultKey ? new Set([defaultKey]) : new Set();
  });

  const toggleDayExpanded = (dateKey) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      if (next.has(dateKey)) {
        next.delete(dateKey);
      } else {
        next.add(dateKey);
      }
      return next;
    });
  };

  const DEFAULT_DAY_SUBTITLES = {
    '2026-10-10': 'Traditional Irembo Day',
    '2026-10-13': 'Beauty Prep & Nails Day',
    '2026-10-14': 'Hair Styling & Toronto Roadtrip Drive',
    '2026-10-15': 'Civil Ceremony, Resto Dinner & Night Club',
    '2026-10-16': 'The Morning After (Brunch) & Family Dinner',
    '2026-10-17': 'Airbnb Checkout & Departure',
  };

  // Splits the day label (e.g. "Thursday, Oct 15") from its subtitle so the
  // two can be styled separately — a small eyebrow date plus a lighter title.
  const getDateRankTitle = (dateKey, label) => {
    const cleanLabel = (label || '').replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
    const custom = dayTitles && dayTitles[dateKey];
    const subtitle = (custom !== undefined && custom !== null && custom !== '')
      ? custom
      : (DEFAULT_DAY_SUBTITLES[dateKey] || '');
    return { dayLabel: cleanLabel, subtitle };
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

          {canEdit && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }} className="no-print">
              <button
                onClick={onOpenAddModal}
                className="btn-primary btn-sm"
                style={{ background: '#111111', color: '#ffffff', border: 'none', fontWeight: 700, padding: '0.6rem 1.35rem', borderRadius: '25px', fontSize: '0.85rem' }}
              >
                <Plus size={16} />
                <span>Add Custom Event</span>
              </button>
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.85rem',
          marginBottom: '2rem'
        }} className="no-print">
          <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888888' }}>
            Showing
          </span>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2rem',
            padding: '0.3rem',
            background: '#f2f2f2',
            borderRadius: '999px',
            flexWrap: 'wrap'
          }}>
            {[
              { key: 'ALL', label: 'All', count: events.length, color: '#111111' },
              { key: 'NIKITA', label: 'Nikita', count: events.filter(e => getEventPerson(e) === 'NIKITA').length, color: '#e08298' },
              { key: 'MANZI', label: 'Manzi', count: events.filter(e => getEventPerson(e) === 'MANZI').length, color: '#8B5E3C' },
              { key: 'BOTH', label: 'Both', count: events.filter(e => getEventPerson(e) === 'BOTH').length, color: '#588157' },
            ].map(f => {
              const active = personFilter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setPersonFilter(f.key)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    background: active ? f.color : 'transparent',
                    color: active ? '#ffffff' : '#666666',
                    boxShadow: active ? '0 2px 8px rgba(0,0,0,0.18)' : 'none',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {f.label}
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.05rem 0.4rem',
                    borderRadius: '999px',
                    background: active ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)',
                    color: active ? '#ffffff' : '#888888'
                  }}>
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>

          {dateRankKeys.length > 1 && (
            <button
              onClick={() => setExpandedDays(
                expandedDays.size === dateRankKeys.length ? new Set() : new Set(dateRankKeys)
              )}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.9rem',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid rgba(0,0,0,0.15)',
                background: 'transparent',
                color: '#555555'
              }}
            >
              {expandedDays.size === dateRankKeys.length
                ? <ChevronsDownUp size={13} />
                : <ChevronsUpDown size={13} />}
              {expandedDays.size === dateRankKeys.length ? 'Collapse All Days' : 'Expand All Days'}
            </button>
          )}
        </div>

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
              const isDayExpanded = expandedDays.has(dateKey);

              return (
                <div
                  key={dateKey}
                  style={{
                    marginBottom: '3.5rem',
                    position: 'relative',
                    paddingLeft: '1.75rem'
                  }}
                >
                  <div className="bw-road-track" />

                  <div className="bw-day-node" />

                  {(() => {
                    const { dayLabel, subtitle } = getDateRankTitle(dateKey, rankGroup.dayLabel);
                    return (
                    <div
                      onClick={() => toggleDayExpanded(dateKey)}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: isDayExpanded ? '1.25rem' : '0', marginTop: '0.2rem', cursor: 'pointer' }}
                    >
                      <ChevronDown
                        size={16}
                        style={{
                          color: 'rgba(0,0,0,0.4)',
                          flexShrink: 0,
                          marginTop: '0.2rem',
                          transition: 'transform 0.2s ease',
                          transform: isDayExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {subtitle && (
                          <div style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            letterSpacing: '0.09em',
                            textTransform: 'uppercase',
                            color: '#999999',
                            marginBottom: '0.15rem'
                          }}>
                            {dayLabel}
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                          <div style={{
                            fontSize: '1.05rem',
                            fontFamily: 'var(--font-sans)',
                            fontWeight: 700,
                            color: '#111111',
                            margin: 0,
                            lineHeight: 1.3
                          }}>
                            {subtitle || dayLabel}
                          </div>

                          {canEdit && onUpdateDayTitle && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const current = (dayTitles && dayTitles[dateKey]) || '';
                                const input = prompt(`Edit Subtitle for ${rankGroup.dayLabel}:`, current);
                                if (input !== null) {
                                  onUpdateDayTitle(dateKey, input.trim());
                                }
                              }}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'rgba(0, 0, 0, 0.35)',
                                padding: '0.2rem',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={(e) => { e.currentTarget.style.color = '#111111'; e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; }}
                              onMouseOut={(e) => { e.currentTarget.style.color = 'rgba(0, 0, 0, 0.35)'; e.currentTarget.style.background = 'transparent'; }}
                              title="Edit Date Subtitle"
                            >
                              <Edit size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    );
                  })()}

                  {isDayExpanded && (
                  <div className="itinerary-day-grid" style={{ alignItems: 'start' }}>
                    {rankGroup.events.map((evt) => {
                      const isFlipped = flippedIds.has(evt.id);
                      const targetWho = getEventPerson(evt);
                      const overdue = !evt.completed && isDateInPast(dateKey);

                      return (
                        <div key={evt.id} style={{ position: 'relative' }}>
                          <div className="bw-connector-line" />
                          <div className="bw-connector-dot" />
                          <div className="bw-card-diamond" />
                          
                          <div
                            className={`flip-card-container event-flip-card ${isFlipped ? 'flipped' : ''}`}
                          >
                            <div className="flip-card-inner">
                              
                              <div
                                className={`flip-card-front glass-card ${overdue ? 'is-overdue' : ''}`}
                                onClick={() => toggleFlip(evt.id)}
                                style={{
                                  background: 'var(--bg-card)',
                                  opacity: 1,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  padding: 0,
                                  borderRadius: '10px',
                                  border: evt.completed
                                    ? '1px solid rgba(88, 129, 87, 0.55)'
                                    : overdue
                                    ? '1px solid rgba(201, 154, 154, 0.5)'
                                    : '1px solid var(--border-color)',
                                  overflow: 'hidden'
                                }}
                              >
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
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        filter: evt.completed ? 'grayscale(0.65) brightness(0.9)' : 'none'
                                      }}
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
                                    border: overdue ? '1px solid rgba(201, 154, 154, 0.4)' : '1px solid rgba(255, 255, 255, 0.22)',
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

                                  {(overdue || targetWho === 'NIKITA' || targetWho === 'MANZI') && (
                                    <div style={{
                                      position: 'absolute',
                                      top: '0.85rem',
                                      right: '0.85rem',
                                      zIndex: 3,
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'flex-end',
                                      gap: '0.4rem'
                                    }}>
                                      {(targetWho === 'NIKITA' || targetWho === 'MANZI') && (
                                        <div style={{
                                          background: targetWho === 'NIKITA' ? '#e08298' : '#8B5E3C',
                                          color: '#ffffff',
                                          padding: '0.35rem 0.85rem',
                                          borderRadius: '16px',
                                          fontSize: '0.75rem',
                                          fontWeight: 700,
                                          letterSpacing: '0.04em',
                                          boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
                                          border: '1px solid rgba(255, 255, 255, 0.3)'
                                        }}>
                                          {targetWho === 'NIKITA' ? 'Nikita' : 'Manzi'}
                                        </div>
                                      )}

                                      {overdue && (
                                        <div style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '0.32rem',
                                          background: 'rgba(74, 50, 48, 0.55)',
                                          backdropFilter: 'blur(12px)',
                                          WebkitBackdropFilter: 'blur(12px)',
                                          border: '1px solid rgba(201, 154, 154, 0.45)',
                                          borderRadius: '20px',
                                          padding: '0.3rem 0.7rem',
                                          fontSize: '0.66rem',
                                          fontWeight: 700,
                                          letterSpacing: '0.1em',
                                          textTransform: 'uppercase',
                                          color: '#e8c9c9',
                                          boxShadow: '0 4px 14px rgba(0,0,0,0.25)'
                                        }}>
                                          <AlertTriangle size={11} />
                                          Overdue
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {evt.completed && (
                                    <div style={{
                                      position: 'absolute',
                                      inset: 0,
                                      zIndex: 4,
                                      background: 'rgba(0, 0, 0, 0.4)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      pointerEvents: 'none'
                                    }}>
                                      <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        background: '#588157',
                                        color: '#ffffff',
                                        padding: '0.5rem 1.1rem',
                                        borderRadius: '999px',
                                        fontSize: '0.82rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        transform: 'rotate(-8deg)',
                                        boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                                        border: '2px solid rgba(255,255,255,0.6)'
                                      }}>
                                        <CheckCircle2 size={16} />
                                        Completed
                                      </div>
                                    </div>
                                  )}

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

                                  <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.02)' }}>
                                    <button
                                      onClick={canEdit ? () => onToggleComplete(evt.id) : undefined}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: 'none',
                                        border: 'none',
                                        cursor: canEdit ? 'pointer' : 'default',
                                        fontSize: '0.82rem',
                                        color: evt.completed ? 'var(--text-muted)' : overdue ? '#a8574a' : 'var(--text-primary)',
                                        fontWeight: 600
                                      }}
                                    >
                                      <div
                                        className={`custom-checkbox ${evt.completed ? 'checked' : ''}`}
                                        style={overdue ? { borderColor: 'rgba(168, 87, 74, 0.55)' } : undefined}
                                      >
                                        {evt.completed && <CheckCircle2 size={14} />}
                                      </div>
                                      <span>
                                        {evt.completed ? 'Marked Completed' : overdue ? 'Overdue — Mark Completed' : canEdit ? 'Mark Event Completed' : 'Not yet completed'}
                                      </span>
                                    </button>

                                    {canEdit && (
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
                                          className="btn-primary btn-sm"
                                          style={{ background: '#111111', color: '#ffffff', border: 'none', padding: '0.35rem 0.85rem', fontSize: '0.78rem', fontWeight: 700 }}
                                        >
                                          <Edit size={12} /> Edit Event Details
                                        </button>

                                        <button
                                          onClick={() => onDeleteEvent(evt.id)}
                                          className="btn-outline btn-sm"
                                          style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem', color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)', fontWeight: 700 }}
                                        >
                                          <Trash2 size={12} /> Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                </div>

                              </div>

                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
