import React, { useState } from 'react';
import { 
  Lock, Plus, Trash2, Key, ShieldCheck, CheckCircle2, FileSignature, 
  Users, Calendar as CalendarIcon, DollarSign, Calculator, Folder, Upload, Download, FileText, Check, Heart, Eye, Save, Sparkles, Clock, MapPin, Send, XCircle
} from 'lucide-react';

export function SecretVault({ 
  currentUser, 
  onLogout, 
  events = [],
  sharedTodos = [],
  manziSecretTodos = [],
  nikitaSecretTodos = [],
  manziSecretNotes = [],
  nikitaSecretNotes = [],
  manziVows = '',
  nikitaVows = '',
  meetingRequests = [],
  onCreateMeetingRequest,
  onRespondMeetingRequest,
  onSaveVows,
  onAddTodo,
  onToggleTodo,
  onSignTodo,
  onDeleteTodo,
  onAddSecretNote,
  onDeleteSecretNote,
  onOpenLoginModal
}) {
  const [activeTab, setActiveTab] = useState('VOWS'); // 'VOWS' | 'MEETINGS' | 'GUESTS' | 'BUDGET' | 'DOCUMENTS' | 'SHARED'
  const [dateFilter, setDateFilter] = useState('ALL');

  const handleTabSelect = (tabKey) => {
    setActiveTab(tabKey);
    setTimeout(() => {
      const el = document.getElementById('active-hub-tool');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Local state for vow editing before saving
  const [localManziVows, setLocalManziVows] = useState(manziVows);
  const [localNikitaVows, setLocalNikitaVows] = useState(nikitaVows);
  const [vowsSaveStatus, setVowsSaveStatus] = useState('');

  // Keep local vows synced when props change
  React.useEffect(() => {
    setLocalManziVows(manziVows);
  }, [manziVows]);

  React.useEffect(() => {
    setLocalNikitaVows(nikitaVows);
  }, [nikitaVows]);

  // Resto Guests & Contributions State
  const [guestList, setGuestList] = useState([]);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestAmount, setNewGuestAmount] = useState('');
  const [newGuestRsvp, setNewGuestRsvp] = useState('Attending');
  const [newGuestNotes, setNewGuestNotes] = useState('');

  // Budget & Expense Calculator State
  const [totalBudget, setTotalBudget] = useState(10000);
  const [expenses, setExpenses] = useState([]);
  const [newExpenseItem, setNewExpenseItem] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('Dining');
  const [newExpenseEst, setNewExpenseEst] = useState('');
  const [newExpenseActual, setNewExpenseActual] = useState('');

  // Classified Document Vault State
  const [docCategoryFilter, setDocCategoryFilter] = useState('ALL');
  const [documents, setDocuments] = useState([]);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('Legal & Marriage');
  const [newDocNotes, setNewDocNotes] = useState('');
  const [newDocFileName, setNewDocFileName] = useState('');

  // Meeting / Date Request Form State
  const [meetTitle, setMeetTitle] = useState('');
  const [meetDate, setMeetDate] = useState('2026-10-14');
  const [meetTime, setMeetTime] = useState('07:00 PM');
  const [meetLocation, setMeetLocation] = useState('King Street West Airbnb');
  const [meetNotes, setMeetNotes] = useState('');

  const handleCreateMeetingSubmit = (e) => {
    e.preventDefault();
    if (!meetTitle || !onCreateMeetingRequest) return;
    const req = {
      id: 'meet-' + Date.now(),
      from: currentUser !== 'GUEST' ? currentUser : 'MANZI',
      to: currentUser === 'MANZI' ? 'NIKITA' : 'MANZI',
      title: meetTitle,
      date: meetDate,
      dayLabel: meetDate === '2026-10-14' ? 'Wednesday, Oct 14' : meetDate === '2026-10-15' ? 'Thursday, Oct 15' : meetDate === '2026-10-16' ? 'Friday, Oct 16' : meetDate,
      time: meetTime,
      location: meetLocation,
      notes: meetNotes || `Meeting invitation from ${currentUser}.`,
      status: 'PENDING',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    onCreateMeetingRequest(req);
    setMeetTitle('');
    setMeetNotes('');
  };

  // Add Todo & Note Form State
  const [newTask, setNewTask] = useState('');
  const [newDate, setNewDate] = useState('2026-10-15');
  const [newCategory, setNewCategory] = useState('Civil Ceremony');
  const [newListType, setNewListType] = useState('SHARED');

  // Calendar View Mode State ('OCTOBER' | 'SEPTEMBER')
  const [calendarViewMode, setCalendarViewMode] = useState('OCTOBER');

  // Personal Notes Workspace State
  const [notesViewMode, setNotesViewMode] = useState('EDITOR'); // 'EDITOR' | 'CHECKLIST'

  const getNoteStorageKey = (user) => `mn_personal_notes_${user || 'GUEST'}_v4`;

  const [personalNotes, setPersonalNotes] = useState(() => 
    localStorage.getItem(getNoteStorageKey(currentUser)) || ''
  );

  React.useEffect(() => {
    const saved = localStorage.getItem(getNoteStorageKey(currentUser));
    setPersonalNotes(saved !== null ? saved : '');
  }, [currentUser]);

  const handleSaveNoteContent = (val) => {
    setPersonalNotes(val);
    localStorage.setItem(getNoteStorageKey(currentUser), val);
  };

  const handleNotesKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const cursor = e.target.selectionStart;
      const value = e.target.value;
      const lineStart = value.lastIndexOf('\n', cursor - 1) + 1;
      const currentLine = value.substring(lineStart, cursor);
      const trimmed = currentLine.trim();

      let insertPrefix = '\n';

      if (trimmed.startsWith('[ ]') || trimmed.startsWith('[x]') || trimmed.startsWith('[X]')) {
        if (trimmed === '[ ]' || trimmed === '[x]' || trimmed === '[X]') {
          const newValue = value.substring(0, lineStart) + value.substring(cursor);
          handleSaveNoteContent(newValue);
          setTimeout(() => {
            if (e.target) e.target.selectionStart = e.target.selectionEnd = lineStart;
          }, 0);
          return;
        }
        insertPrefix = '\n[ ] ';
      } else if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
        if (trimmed === '•' || trimmed === '-' || trimmed === '*') {
          const newValue = value.substring(0, lineStart) + value.substring(cursor);
          handleSaveNoteContent(newValue);
          setTimeout(() => {
            if (e.target) e.target.selectionStart = e.target.selectionEnd = lineStart;
          }, 0);
          return;
        }
        insertPrefix = '\n• ';
      }

      const newValue = value.substring(0, cursor) + insertPrefix + value.substring(cursor);
      handleSaveNoteContent(newValue);
      setTimeout(() => {
        if (e.target) e.target.selectionStart = e.target.selectionEnd = cursor + insertPrefix.length;
      }, 0);
    }
  };

  const isManzi = currentUser === 'MANZI';
  const isNikita = currentUser === 'NIKITA';

  // Map events to date keys with robust date normalization (YYYY-MM-DD)
  const eventsByDate = events.reduce((acc, evt) => {
    if (!evt || !evt.date) return acc;
    let key = evt.date;

    // Normalize format like "2026-10-5" or ISO strings -> "2026-10-05"
    if (key.includes('-')) {
      const parts = key.split('T')[0].split('-');
      if (parts.length === 3) {
        const y = parts[0];
        const m = parts[1].padStart(2, '0');
        const d = parts[2].padStart(2, '0');
        key = `${y}-${m}-${d}`;
      }
    }

    if (!acc[key]) acc[key] = [];
    acc[key].push(evt);
    return acc;
  }, {});

  const privateTodos = isManzi ? manziSecretTodos : isNikita ? nikitaSecretTodos : [];

  const filteredSharedTodos = dateFilter === 'ALL' 
    ? sharedTodos 
    : sharedTodos.filter(t => t.date === dateFilter);

  // Financial Calculations
  const totalRestoCollected = guestList.reduce((sum, g) => sum + (g.contributed ? Number(g.amount || 0) : 0), 0);
  const totalAttendingGuests = guestList.filter(g => g.rsvp === 'Attending').length;

  const totalActualSpent = expenses.reduce((sum, e) => sum + Number(e.actual || 0), 0);
  const remainingBudgetLeft = totalBudget - totalActualSpent;

  // Handlers
  const handleSaveVowsSubmit = (e) => {
    if (e) e.preventDefault();
    if (isManzi) {
      if (onSaveVows) onSaveVows(localManziVows);
      setVowsSaveStatus("Manzi's vows saved securely!");
    } else if (isNikita) {
      if (onSaveVows) onSaveVows(localNikitaVows);
      setVowsSaveStatus("Nikita's vows saved securely!");
    }
    setTimeout(() => setVowsSaveStatus(''), 4000);
  };

  const handleAddGuest = (e) => {
    e.preventDefault();
    if (!newGuestName) return;
    setGuestList(prev => [
      ...prev,
      {
        id: 'g-' + Date.now(),
        name: newGuestName,
        rsvp: newGuestRsvp,
        contributed: Number(newGuestAmount) > 0,
        amount: Number(newGuestAmount || 0),
        notes: newGuestNotes || 'Added to Resto List'
      }
    ]);
    setNewGuestName('');
    setNewGuestAmount('');
    setNewGuestNotes('');
  };

  const handleToggleGuestContribution = (guestId) => {
    setGuestList(prev => prev.map(g => {
      if (g.id === guestId) {
        return { ...g, contributed: !g.contributed };
      }
      return g;
    }));
  };

  const handleDeleteGuest = (guestId) => {
    setGuestList(prev => prev.filter(g => g.id !== guestId));
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpenseItem) return;
    setExpenses(prev => [
      ...prev,
      {
        id: 'b-' + Date.now(),
        item: newExpenseItem,
        category: newExpenseCategory,
        estimated: Number(newExpenseEst || 0),
        actual: Number(newExpenseActual || 0)
      }
    ]);
    setNewExpenseItem('');
    setNewExpenseEst('');
    setNewExpenseActual('');
  };

  const handleDeleteExpense = (expId) => {
    setExpenses(prev => prev.filter(e => e.id !== expId));
  };

  const handleDocumentFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDocFileName(file.name);
    }
  };

  const handleAddDocument = (e) => {
    e.preventDefault();
    if (!newDocTitle) return;
    setDocuments(prev => [
      {
        id: 'doc-' + Date.now(),
        title: newDocTitle,
        category: newDocCategory,
        fileName: newDocFileName || `${newDocTitle.replace(/\s+/g, '_')}.pdf`,
        fileSize: '1.2 MB',
        dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        notes: newDocNotes || 'Saved in Document Vault'
      },
      ...prev
    ]);
    setNewDocTitle('');
    setNewDocNotes('');
    setNewDocFileName('');
  };

  const handleDeleteDocument = (docId) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  };

  // Helper function for event theme color tags
  const getEventTheme = (evt) => {
    const who = evt.forWho || (
      evt.title?.toLowerCase().includes('nikita') || evt.title?.toLowerCase().includes('nail') || evt.title?.toLowerCase().includes('hair') || evt.notes?.toLowerCase().includes('nikita') ? 'NIKITA' :
      evt.title?.toLowerCase().includes('manzi') || evt.title?.toLowerCase().includes('suit') || evt.title?.toLowerCase().includes('barber') || evt.notes?.toLowerCase().includes('manzi') ? 'MANZI' :
      'BOTH'
    );

    if (who === 'NIKITA') {
      return {
        bg: '#e08298',
        color: '#ffffff',
        label: 'Nikita',
        border: '1px solid rgba(224, 130, 152, 0.6)'
      };
    } else if (who === 'MANZI') {
      return {
        bg: '#8B5E3C',
        color: '#ffffff',
        label: 'Manzi',
        border: '1px solid rgba(139, 94, 60, 0.6)'
      };
    } else {
      return {
        bg: '#588157',
        color: '#ffffff',
        label: 'Both',
        border: '1px solid rgba(88, 129, 87, 0.6)'
      };
    }
  };

  // Build September & October 2026 Dual Calendar Grid
  const renderMonthsCalendar = () => {
    const monthConfigs = [
      {
        monthName: 'September 2026',
        yearMonthKey: '2026-09',
        daysCount: 30,
        paddingCount: 2,
        subtitle: 'Pre-wedding milestones & paperwork'
      },
      {
        monthName: 'October 2026',
        yearMonthKey: '2026-10',
        daysCount: 31,
        paddingCount: 4,
        subtitle: 'Civil Ceremony, roadtrip & celebrations'
      }
    ];

    const activeConfigs = calendarViewMode === 'SEPTEMBER' 
      ? [monthConfigs[0]]
      : [monthConfigs[1]];

    return (
      <div style={{
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        background: '#121214',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        padding: '1.5rem',
        marginTop: '3rem',
        boxShadow: '0 16px 40px rgba(0,0,0,0.6)'
      }}>
        {/* Calendar Main Section Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          paddingBottom: '1rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <CalendarIcon size={24} style={{ color: '#ffffff' }} />
            <div>
              <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontStyle: 'normal', color: '#ffffff', margin: 0, fontWeight: 600 }}>
                Civil Wedding Calendar — Sept &amp; Oct 2026
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', margin: 0, marginTop: '0.2rem' }}>
                Select between September 2026 and October 2026.
              </p>
            </div>
          </div>

          {/* Month Switcher Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-flex',
              background: '#09090b',
              padding: '0.25rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <button
                onClick={() => setCalendarViewMode('SEPTEMBER')}
                style={{
                  padding: '0.35rem 0.9rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  borderRadius: '9px',
                  border: 'none',
                  cursor: 'pointer',
                  background: calendarViewMode === 'SEPTEMBER' ? '#ffffff' : 'transparent',
                  color: calendarViewMode === 'SEPTEMBER' ? '#000000' : 'rgba(255, 255, 255, 0.7)',
                  transition: 'all 0.2s ease'
                }}
              >
                September
              </button>
              <button
                onClick={() => setCalendarViewMode('OCTOBER')}
                style={{
                  padding: '0.35rem 0.9rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  borderRadius: '9px',
                  border: 'none',
                  cursor: 'pointer',
                  background: calendarViewMode === 'OCTOBER' ? '#ffffff' : 'transparent',
                  color: calendarViewMode === 'OCTOBER' ? '#000000' : 'rgba(255, 255, 255, 0.7)',
                  transition: 'all 0.2s ease'
                }}
              >
                October
              </button>
            </div>

            {dateFilter !== 'ALL' && (
              <button 
                onClick={() => setDateFilter('ALL')}
                className="btn-outline btn-sm"
                style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem', color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Calendar Color Legend Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          flexWrap: 'wrap',
          fontSize: '0.78rem',
          fontWeight: 600,
          background: '#18181c',
          padding: '0.5rem 0.9rem',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          marginBottom: '1.25rem'
        }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.68rem' }}>
            Event Color Legend:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#e08298', display: 'inline-block' }} />
            <span style={{ color: '#ffffff' }}>Nikita</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#8B5E3C', display: 'inline-block' }} />
            <span style={{ color: '#ffffff' }}>Manzi</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#588157', display: 'inline-block' }} />
            <span style={{ color: '#ffffff' }}>Both</span>
          </div>
        </div>

        {/* Render Selected Month */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {activeConfigs.map((cfg) => {
            const padding = Array(cfg.paddingCount).fill(null);
            const days = [];
            for (let i = 1; i <= cfg.daysCount; i++) {
              const dayStr = i < 10 ? `0${i}` : `${i}`;
              const dateKey = `${cfg.yearMonthKey}-${dayStr}`;
              const dayEvents = eventsByDate[dateKey] || [];
              const isSelected = dateFilter === dateKey;
              const isWeddingDay = dateKey === '2026-10-15';

              days.push({
                dayNum: i,
                dateKey,
                dayEvents,
                isSelected,
                isWeddingDay
              });
            }

            return (
              <div key={cfg.yearMonthKey} style={{
                background: '#16161a',
                padding: '1rem',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxSizing: 'border-box'
              }}>
                {/* Month Title Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingBottom: '0.4rem'
                }}>
                  <h4 style={{
                    fontSize: '1.25rem',
                    fontFamily: 'var(--font-serif)',
                    color: '#ffffff',
                    margin: 0,
                    fontWeight: 600,
                    letterSpacing: '0.02em'
                  }}>
                    {cfg.monthName}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                    {cfg.subtitle}
                  </span>
                </div>

                {/* Days of Week Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '0.35rem',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.5rem'
                }}>
                  <div>Su</div>
                  <div>Mo</div>
                  <div>Tu</div>
                  <div>We</div>
                  <div>Th</div>
                  <div>Fr</div>
                  <div>Sa</div>
                </div>

                {/* Calendar Grid Cells */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '0.35rem'
                }}>
                  {padding.map((_, idx) => (
                    <div key={`pad-${cfg.yearMonthKey}-${idx}`} style={{ minHeight: '65px', background: 'transparent' }} />
                  ))}

                  {days.map((d) => (
                    <div
                      key={d.dateKey}
                      onClick={() => setDateFilter(d.isSelected ? 'ALL' : d.dateKey)}
                      style={{
                        minHeight: '65px',
                        borderRadius: '9px',
                        border: d.isSelected 
                          ? '2px solid #ffffff' 
                          : d.isWeddingDay 
                          ? '2px solid #ffffff' 
                          : d.dayEvents.length > 0 
                          ? '1px solid rgba(255, 255, 255, 0.4)' 
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        background: d.isSelected 
                          ? 'rgba(255, 255, 255, 0.22)' 
                          : d.isWeddingDay 
                          ? '#222226' 
                          : d.dayEvents.length > 0
                          ? '#1a1a1e'
                          : '#121214',
                        padding: '0.35rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        boxSizing: 'border-box'
                      }}
                    >
                      {/* Day Number Header */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.2rem'
                      }}>
                        <span style={{
                          fontSize: '0.8rem',
                          fontWeight: d.dayEvents.length > 0 ? 800 : 500,
                          color: d.isWeddingDay ? '#ffffff' : d.dayEvents.length > 0 ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'
                        }}>
                          {d.dayNum}
                        </span>

                        {d.isWeddingDay && (
                          <span style={{ fontSize: '0.5rem', fontWeight: 800, background: '#ffffff', color: '#000000', padding: '0.05rem 0.25rem', borderRadius: '3px', letterSpacing: '0.04em' }}>
                            WED
                          </span>
                        )}
                      </div>

                      {/* Event Indicators */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', overflow: 'hidden' }}>
                        {d.dayEvents.map((evt) => {
                          const theme = getEventTheme(evt);
                          return (
                            <div
                              key={evt.id}
                              style={{
                                fontSize: '0.62rem',
                                fontWeight: 700,
                                background: theme.bg,
                                color: theme.color,
                                border: theme.border,
                                padding: '0.15rem 0.3rem',
                                borderRadius: '4px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                lineHeight: 1.2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.15rem'
                              }}
                              title={`${evt.title} (${evt.time}) - ${theme.label}`}
                            >
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{evt.title}</span>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section id="vault" style={{
      paddingBottom: '5rem',
      paddingTop: '3rem',
      backgroundImage: `linear-gradient(to bottom, rgba(5,5,7,0.7), rgba(5,5,7,0.88)), url('/images/backgroungImage.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: '#ffffff',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div className="container" style={{ width: '100%', boxSizing: 'border-box' }}>
        
        {/* Main Glassmorphism Hub Container */}
        <div style={{
          background: 'rgba(18, 18, 20, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          
          {/* Main Title & Spouse Profile Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            paddingBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}>
            <div>
              <h2 style={{ fontSize: '2.6rem', fontFamily: 'var(--font-serif)', fontStyle: 'normal', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                Civil Wedding Planning Hub
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem', maxWidth: '680px', marginTop: '0.4rem', lineHeight: 1.5 }}>
                Manage private wedding vows, restaurant contributions, budget calculations, classified documents, and joint couple checklists!
              </p>
            </div>

            {(isManzi || isNikita) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  padding: '0.55rem 1.1rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  background: isManzi ? '#8B5E3C' : '#E08298',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <ShieldCheck size={16} />
                  Profile: {isManzi ? 'Manzi' : 'Nikita'}
                </span>
              </div>
            )}
          </div>

          {/* PROMINENT FEATURE CARDS GRID (UNISEX & DISTINCT COLOR PALETTE) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.1rem',
            marginBottom: '2.5rem'
          }}>
            {/* Card 1: Secret Wedding Vows (Velvet Crimson Red) */}
            <div 
              onClick={() => setActiveTab('VOWS')}
              style={{
                background: activeTab === 'VOWS' 
                  ? 'linear-gradient(135deg, #361417 0%, #541D22 100%)' 
                  : 'linear-gradient(135deg, #241113 0%, #1A0D0E 100%)',
                color: '#ffffff',
                border: activeTab === 'VOWS' ? '2px solid #EF5350' : '1px solid rgba(239, 83, 80, 0.35)',
                borderRadius: '18px',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeTab === 'VOWS' ? '0 10px 28px rgba(239, 83, 80, 0.3)' : '0 4px 12px rgba(0,0,0,0.2)',
                transform: activeTab === 'VOWS' ? 'translateY(-3px)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '135px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Lock size={22} style={{ color: '#EF9A9A' }} />
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    background: '#C62828',
                    color: '#ffffff',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}>
                    PRIVATE
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0.65rem 0 0.2rem 0', fontFamily: 'var(--font-serif)', fontStyle: 'normal', color: '#ffffff' }}>
                  Secret Wedding Vows
                </h3>
                <p style={{ fontSize: '0.78rem', margin: 0, color: 'rgba(255, 255, 255, 0.75)' }}>
                  Strictly private & sealed
                </p>
              </div>

              <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '0.85rem', borderTop: '1px solid rgba(239, 83, 80, 0.25)', paddingTop: '0.5rem', color: '#FFCDD2' }}>
                {isManzi ? "Manzi's Vows Unlocked" : isNikita ? "Nikita's Vows Unlocked" : "Unlock Vows with Passcode"} →
              </div>
            </div>

            {/* Card 2: Resto Money & Guests (Golden Amber / Warm Bronze - Non Green) */}
            <div 
              onClick={() => setActiveTab('GUESTS')}
              style={{
                background: activeTab === 'GUESTS' 
                  ? 'linear-gradient(135deg, #332714 0%, #523D1B 100%)' 
                  : 'linear-gradient(135deg, #211A10 0%, #17130C 100%)',
                color: '#ffffff',
                border: activeTab === 'GUESTS' ? '2px solid #FFC107' : '1px solid rgba(255, 193, 7, 0.35)',
                borderRadius: '18px',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeTab === 'GUESTS' ? '0 10px 28px rgba(255, 193, 7, 0.3)' : '0 4px 12px rgba(0,0,0,0.2)',
                transform: activeTab === 'GUESTS' ? 'translateY(-3px)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '135px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <DollarSign size={22} style={{ color: '#FFD54F' }} />
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    background: '#F57F17',
                    color: '#ffffff',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}>
                    FINANCE
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0.65rem 0 0.2rem 0', fontFamily: 'var(--font-serif)', fontStyle: 'normal', color: '#ffffff' }}>
                  Resto Money & Guests
                </h3>
                <p style={{ fontSize: '0.78rem', margin: 0, color: 'rgba(255, 255, 255, 0.75)' }}>
                  Guest RSVPs & contributions
                </p>
              </div>

              <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '0.85rem', borderTop: '1px solid rgba(255, 193, 7, 0.25)', paddingTop: '0.5rem', color: '#FFE082' }}>
                ${totalRestoCollected} Collected ({totalAttendingGuests} Guests) →
              </div>
            </div>

            {/* Card 3: Budget & Expense Calculator (Royal Amethyst Purple) */}
            <div 
              onClick={() => setActiveTab('BUDGET')}
              style={{
                background: activeTab === 'BUDGET' 
                  ? 'linear-gradient(135deg, #2B1D3A 0%, #442B5C 100%)' 
                  : 'linear-gradient(135deg, #1C1326 0%, #150E1F 100%)',
                color: '#ffffff',
                border: activeTab === 'BUDGET' ? '2px solid #BA68C8' : '1px solid rgba(186, 104, 200, 0.35)',
                borderRadius: '18px',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeTab === 'BUDGET' ? '0 10px 28px rgba(186, 104, 200, 0.3)' : '0 4px 12px rgba(0,0,0,0.2)',
                transform: activeTab === 'BUDGET' ? 'translateY(-3px)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '135px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Calculator size={22} style={{ color: '#CE93D8' }} />
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    background: '#8E24AA',
                    color: '#ffffff',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}>
                    CALCULATOR
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0.65rem 0 0.2rem 0', fontFamily: 'var(--font-serif)', fontStyle: 'normal', color: '#ffffff' }}>
                  Budget & Expense
                </h3>
                <p style={{ fontSize: '0.78rem', margin: 0, color: 'rgba(255, 255, 255, 0.75)' }}>
                  Live budget calculator
                </p>
              </div>

              <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '0.85rem', borderTop: '1px solid rgba(186, 104, 200, 0.25)', paddingTop: '0.5rem', color: '#E1BEE7' }}>
                ${totalActualSpent} Spent / ${remainingBudgetLeft} Left →
              </div>
            </div>

            {/* Card 4: Digital Dossier & Files (Sapphire Blue) */}
            <div 
              onClick={() => setActiveTab('DOCUMENTS')}
              style={{
                background: activeTab === 'DOCUMENTS' 
                  ? 'linear-gradient(135deg, #142036 0%, #1D3254 100%)' 
                  : 'linear-gradient(135deg, #101724 0%, #0D121C 100%)',
                color: '#ffffff',
                border: activeTab === 'DOCUMENTS' ? '2px solid #64B5F6' : '1px solid rgba(100, 181, 246, 0.35)',
                borderRadius: '18px',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeTab === 'DOCUMENTS' ? '0 10px 28px rgba(100, 181, 246, 0.3)' : '0 4px 12px rgba(0,0,0,0.2)',
                transform: activeTab === 'DOCUMENTS' ? 'translateY(-3px)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '135px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Folder size={22} style={{ color: '#90CAF9' }} />
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    background: '#1976D2',
                    color: '#ffffff',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}>
                    DOSSIER
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0.65rem 0 0.2rem 0', fontFamily: 'var(--font-serif)', fontStyle: 'normal', color: '#ffffff' }}>
                  Digital Dossier & Files
                </h3>
                <p style={{ fontSize: '0.78rem', margin: 0, color: 'rgba(255, 255, 255, 0.75)' }}>
                  Classified trip documents & vouchers
                </p>
              </div>

              <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '0.85rem', borderTop: '1px solid rgba(100, 181, 246, 0.25)', paddingTop: '0.5rem', color: '#BBDEFB' }}>
                {documents.length} Dossier Files Stored →
              </div>
            </div>

            {/* Card 5: Shared Joint Tasks (Electric Cyan) */}
            <div 
              onClick={() => setActiveTab('SHARED')}
              style={{
                background: activeTab === 'SHARED' 
                  ? 'linear-gradient(135deg, #122B32 0%, #1A4652 100%)' 
                  : 'linear-gradient(135deg, #111E24 0%, #10161A 100%)',
                color: '#ffffff',
                border: activeTab === 'SHARED' ? '2px solid #4DD0E1' : '1px solid rgba(77, 208, 225, 0.35)',
                borderRadius: '18px',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeTab === 'SHARED' ? '0 10px 28px rgba(77, 208, 225, 0.3)' : '0 4px 12px rgba(0,0,0,0.2)',
                transform: activeTab === 'SHARED' ? 'translateY(-3px)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '135px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Users size={22} style={{ color: '#4DD0E1' }} />
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    background: '#00897B',
                    color: '#ffffff',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}>
                    CHECKLIST
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0.65rem 0 0.2rem 0', fontFamily: 'var(--font-serif)', fontStyle: 'normal', color: '#ffffff' }}>
                  Shared Couple Tasks
                </h3>
                <p style={{ fontSize: '0.78rem', margin: 0, color: 'rgba(255, 255, 255, 0.75)' }}>
                  Couple wedding checklist
                </p>
              </div>

              <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '0.85rem', borderTop: '1px solid rgba(77, 208, 225, 0.25)', paddingTop: '0.5rem', color: '#B2EBF2' }}>
                {sharedTodos.filter(t => t.completed).length} / {sharedTodos.length} Tasks Complete →
              </div>
            </div>

            {/* Card 6: Date & Meeting Invites (Emerald / Rose) */}
            <div 
              onClick={() => setActiveTab('MEETINGS')}
              style={{
                background: activeTab === 'MEETINGS' 
                  ? 'linear-gradient(135deg, #1C2E26 0%, #2A483B 100%)' 
                  : 'linear-gradient(135deg, #131E19 0%, #0E1612 100%)',
                color: '#ffffff',
                border: activeTab === 'MEETINGS' ? '2px solid #81C784' : '1px solid rgba(129, 199, 132, 0.35)',
                borderRadius: '18px',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeTab === 'MEETINGS' ? '0 10px 28px rgba(129, 199, 132, 0.3)' : '0 4px 12px rgba(0,0,0,0.2)',
                transform: activeTab === 'MEETINGS' ? 'translateY(-3px)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '135px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <CalendarIcon size={22} style={{ color: '#81C784' }} />
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    background: '#2E7D32',
                    color: '#ffffff',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}>
                    MEETINGS
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0.65rem 0 0.2rem 0', fontFamily: 'var(--font-serif)', fontStyle: 'normal', color: '#ffffff' }}>
                  Date &amp; Meeting Invites
                </h3>
                <p style={{ fontSize: '0.78rem', margin: 0, color: 'rgba(255, 255, 255, 0.75)' }}>
                  Schedule &amp; respond to partner dates
                </p>
              </div>

              <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '0.85rem', borderTop: '1px solid rgba(129, 199, 132, 0.25)', paddingTop: '0.5rem', color: '#C8E6C9' }}>
                {meetingRequests.filter(m => m.status === 'PENDING').length} Pending Invites →
              </div>
            </div>
          </div>

          {/* ACTIVE TOOL FEATURE VIEW */}
          <div style={{ background: '#121214', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', padding: '2rem' }}>
            
            {/* FEATURE VIEW 1: SECRET WEDDING VOWS VAULT */}
            {activeTab === 'VOWS' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', fontStyle: 'normal', color: '#ffffff', margin: 0, fontWeight: 600 }}>
                      Secret Wedding Vows Vault
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.65)', margin: 0, marginTop: '0.2rem' }}>
                      Strictly isolated per person so you do not read each other's vows before the civil ceremony on Oct 15!
                    </p>
                  </div>

                  {vowsSaveStatus && (
                    <div style={{ padding: '0.4rem 0.85rem', borderRadius: '20px', background: '#22c55e', color: '#ffffff', fontSize: '0.82rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Check size={14} /> {vowsSaveStatus}
                    </div>
                  )}
                </div>

                {isManzi ? (
                  /* MANZI ONLY VIEW */
                  <div style={{ maxWidth: '680px', margin: '0 auto' }}>
                    <div style={{
                      background: '#18181c',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '18px',
                      padding: '1.75rem',
                      position: 'relative'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Heart size={18} style={{ color: '#ffffff' }} />
                          <h4 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-serif)', fontStyle: 'normal', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                            Manzi's Secret Wedding Vows
                          </h4>
                        </div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.12)', color: '#ffffff', textTransform: 'uppercase' }}>
                          Groom's Speech
                        </span>
                      </div>

                      <form onSubmit={handleSaveVowsSubmit}>
                        <label style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '0.5rem' }}>
                          Write & refine your private vows for Nikita:
                        </label>
                        <textarea
                          value={localManziVows}
                          onChange={(e) => setLocalManziVows(e.target.value)}
                          placeholder="Write your heartfelt vows here..."
                          rows={9}
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            background: '#121214',
                            border: '1px solid rgba(255,255,255,0.25)',
                            borderRadius: '12px',
                            padding: '1rem',
                            color: '#ffffff',
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.05rem',
                            lineHeight: 1.6,
                            resize: 'vertical',
                            marginBottom: '1rem'
                          }}
                        />

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
                            {localManziVows.trim().split(/\s+/).filter(Boolean).length} words • Private to Manzi (Sealed from Nikita)
                          </span>
                          <button type="submit" className="btn-primary btn-sm" style={{ background: '#ffffff', color: '#000000', border: 'none', fontWeight: 700, padding: '0.55rem 1.35rem' }}>
                            <Save size={14} /> Save Manzi's Vows
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : isNikita ? (
                  /* NIKITA ONLY VIEW */
                  <div style={{ maxWidth: '680px', margin: '0 auto' }}>
                    <div style={{
                      background: '#18181c',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '18px',
                      padding: '1.75rem',
                      position: 'relative'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Heart size={18} style={{ color: '#ffffff' }} />
                          <h4 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-serif)', fontStyle: 'normal', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                            Nikita's Secret Wedding Vows
                          </h4>
                        </div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.12)', color: '#ffffff', textTransform: 'uppercase' }}>
                          Bride's Speech
                        </span>
                      </div>

                      <form onSubmit={handleSaveVowsSubmit}>
                        <label style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '0.5rem' }}>
                          Write & refine your private vows for Manzi:
                        </label>
                        <textarea
                          value={localNikitaVows}
                          onChange={(e) => setLocalNikitaVows(e.target.value)}
                          placeholder="Write your heartfelt vows here..."
                          rows={9}
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            background: '#121214',
                            border: '1px solid rgba(255,255,255,0.25)',
                            borderRadius: '12px',
                            padding: '1rem',
                            color: '#ffffff',
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.05rem',
                            lineHeight: 1.6,
                            resize: 'vertical',
                            marginBottom: '1rem'
                          }}
                        />

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
                            {localNikitaVows.trim().split(/\s+/).filter(Boolean).length} words • Private to Nikita (Sealed from Manzi)
                          </span>
                          <button type="submit" className="btn-primary btn-sm" style={{ background: '#ffffff', color: '#000000', border: 'none', fontWeight: 700, padding: '0.55rem 1.35rem' }}>
                            <Save size={14} /> Save Nikita's Vows
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : (
                  /* GUEST / NOT SIGNED IN VIEW */
                  <div style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center', padding: '2.5rem 1.5rem', background: '#18181c', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: '#222226',
                      border: '2px solid rgba(255,255,255,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem auto'
                    }}>
                      <Lock size={30} style={{ color: '#ffffff' }} />
                    </div>
                    <h4 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', fontWeight: 600, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
                      Secret Wedding Vows
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                      Enter your 4-digit PIN to view and edit your private wedding vows. Vows remain strictly private until the ceremony!
                    </p>
                    <button 
                      onClick={() => onOpenLoginModal(isManzi ? 'MANZI' : 'NIKITA')} 
                      className="btn-primary" 
                      style={{ background: '#ffffff', color: '#000000', border: 'none', fontWeight: 700, padding: '0.75rem 1.75rem', borderRadius: '30px', fontSize: '0.95rem' }}
                    >
                      <Key size={16} /> Unlock Vows with Passcode
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* FEATURE VIEW 2: RESTO MONEY & GUEST LIST TRACKER */}
            {activeTab === 'GUESTS' && (
              <div>
                <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontStyle: 'normal', color: '#ffffff', marginBottom: '1.25rem', fontWeight: 600 }}>
                  Resto Money & Guest List Tracker
                </h3>

                {/* Summary Counter Bar */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                  <div style={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Total Resto Funds Collected
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
                      ${totalRestoCollected}
                    </div>
                  </div>

                  <div style={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Attending Guests
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
                      {totalAttendingGuests} Guests
                    </div>
                  </div>

                  <div style={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Contribution Rate
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
                      {guestList.length > 0 ? Math.round((guestList.filter(g => g.contributed).length / guestList.length) * 100) : 0}% Paid
                    </div>
                  </div>
                </div>

                {/* Form: Add Guest & Resto Money */}
                <form onSubmit={handleAddGuest} style={{ background: '#18181c', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', marginBottom: '1.75rem' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
                    + Add Guest & Restaurant Money Contribution
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', alignItems: 'end' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>Guest / Family Name</label>
                      <input
                        type="text"
                        value={newGuestName}
                        onChange={(e) => setNewGuestName(e.target.value)}
                        placeholder="e.g. Aime & Family..."
                        className="form-input"
                        style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', background: '#121214', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>Resto Contribution ($)</label>
                      <input
                        type="number"
                        value={newGuestAmount}
                        onChange={(e) => setNewGuestAmount(e.target.value)}
                        placeholder="e.g. 150"
                        className="form-input"
                        style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', background: '#121214', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>RSVP Status</label>
                      <select
                        value={newGuestRsvp}
                        onChange={(e) => setNewGuestRsvp(e.target.value)}
                        className="form-select"
                        style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', background: '#121214', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
                      >
                        <option value="Attending">Attending</option>
                        <option value="Pending">Pending</option>
                        <option value="Declined">Declined</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>Notes / Payment Method</label>
                      <input
                        type="text"
                        value={newGuestNotes}
                        onChange={(e) => setNewGuestNotes(e.target.value)}
                        placeholder="e.g. e-Transfer / Cash"
                        className="form-input"
                        style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', background: '#121214', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
                      />
                    </div>

                    <button type="submit" className="btn-primary btn-sm" style={{ background: '#ffffff', color: '#000000', border: 'none', fontWeight: 700, padding: '0.55rem 1.25rem' }}>
                      <Plus size={15} /> Add Guest
                    </button>
                  </div>
                </form>

                {/* Guest List Table */}
                <div style={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                        <th style={{ padding: '0.85rem 1rem' }}>Guest Name</th>
                        <th style={{ padding: '0.85rem 1rem' }}>RSVP</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Resto Contribution ($)</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Payment Status</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Notes</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guestList.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                            No guest contributions added yet. Use the form above to add your first guest!
                          </td>
                        </tr>
                      ) : (
                        guestList.map(g => (
                        <tr key={g.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{g.name}</td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span style={{ padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(255,255,255,0.1)', color: '#ffffff' }}>
                              {g.rsvp}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>${g.amount || 0}</td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <button
                              onClick={() => handleToggleGuestContribution(g.id)}
                              style={{
                                padding: '0.25rem 0.65rem',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                border: 'none',
                                background: g.contributed ? '#ffffff' : 'rgba(255,255,255,0.15)',
                                color: g.contributed ? '#000000' : '#ffffff'
                              }}
                            >
                              {g.contributed ? 'Paid' : 'Pending'}
                            </button>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>{g.notes}</td>
                          <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                            <button onClick={() => handleDeleteGuest(g.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}>
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FEATURE VIEW 3: BUDGET & EXPENSE CALCULATOR */}
            {activeTab === 'BUDGET' && (
              <div>
                <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontStyle: 'normal', color: '#ffffff', marginBottom: '1.25rem', fontWeight: 600 }}>
                  Budget & Expense Calculator
                </h3>

                {/* Calculations Summary Bar */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                  <div style={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Total Allocated Budget
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                      <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>$</span>
                      <input
                        type="number"
                        value={totalBudget}
                        onChange={(e) => setTotalBudget(Number(e.target.value || 0))}
                        style={{ fontSize: '1.6rem', fontWeight: 800, background: 'transparent', border: 'none', color: '#ffffff', width: '130px' }}
                      />
                    </div>
                  </div>

                  <div style={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Total Pulled Out / Spent
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
                      ${totalActualSpent}
                    </div>
                  </div>

                  <div style={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Budget Remaining / Left
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: remainingBudgetLeft >= 0 ? '#ffffff' : '#ff6b6b', marginTop: '0.2rem' }}>
                      ${remainingBudgetLeft}
                    </div>
                  </div>
                </div>

                {/* Form: Add Budget Line Item */}
                <form onSubmit={handleAddExpense} style={{ background: '#18181c', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', marginBottom: '1.75rem' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
                    + Add Expense Line Item
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', alignItems: 'end' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>Item Description</label>
                      <input
                        type="text"
                        value={newExpenseItem}
                        onChange={(e) => setNewExpenseItem(e.target.value)}
                        placeholder="e.g. Resto Reservation Deposit..."
                        className="form-input"
                        style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', background: '#121214', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>Category</label>
                      <select
                        value={newExpenseCategory}
                        onChange={(e) => setNewExpenseCategory(e.target.value)}
                        className="form-select"
                        style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', background: '#121214', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
                      >
                        <option value="Legal">Legal & Ceremony</option>
                        <option value="Stay">Hotel & Stay</option>
                        <option value="Dining">Dining & Food</option>
                        <option value="Attire">Attire & Rings</option>
                        <option value="Beauty">Hair & Beauty</option>
                        <option value="Travel">Travel & Roadtrip</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>Estimated Cost ($)</label>
                      <input
                        type="number"
                        value={newExpenseEst}
                        onChange={(e) => setNewExpenseEst(e.target.value)}
                        placeholder="e.g. 500"
                        className="form-input"
                        style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', background: '#121214', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>Actual Pulled Out ($)</label>
                      <input
                        type="number"
                        value={newExpenseActual}
                        onChange={(e) => setNewExpenseActual(e.target.value)}
                        placeholder="e.g. 450"
                        className="form-input"
                        style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', background: '#121214', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
                      />
                    </div>

                    <button type="submit" className="btn-primary btn-sm" style={{ background: '#ffffff', color: '#000000', border: 'none', fontWeight: 700, padding: '0.55rem 1.25rem' }}>
                      <Plus size={15} /> Add Expense
                    </button>
                  </div>
                </form>

                {/* Expense Line Items Table */}
                <div style={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                        <th style={{ padding: '0.85rem 1rem' }}>Item Description</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Estimated Cost</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Actual Pulled Out</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Difference</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                            No budget line items added yet. Use the form above to add your first expense!
                          </td>
                        </tr>
                      ) : (
                        expenses.map(e => {
                        const diff = Number(e.estimated || 0) - Number(e.actual || 0);
                        return (
                          <tr key={e.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{e.item}</td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <span style={{ padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.72rem', background: 'rgba(255,255,255,0.1)', color: '#ffffff' }}>
                                {e.category}
                              </span>
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>${e.estimated}</td>
                            <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>${e.actual}</td>
                            <td style={{ padding: '0.85rem 1rem', color: diff >= 0 ? '#ffffff' : '#ff6b6b' }}>
                              {diff >= 0 ? `+$${diff}` : `-$${Math.abs(diff)}`}
                            </td>
                            <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                              <button onClick={() => handleDeleteExpense(e.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}>
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      }))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FEATURE VIEW 4: CLASSIFIED DIGITAL DOCUMENT STORAGE */}
            {activeTab === 'DOCUMENTS' && (
              <div>
                <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontStyle: 'normal', color: '#ffffff', marginBottom: '1.25rem', fontWeight: 600 }}>
                  Classified Digital Dossier & Files
                </h3>

                {/* Category Filter Pills */}
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1.5rem' }}>
                  {['ALL', 'Legal & Marriage', 'Hotel & Travel', 'Vendor Receipts', 'Personal & Notes'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setDocCategoryFilter(cat)}
                      style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: docCategoryFilter === cat ? '#ffffff' : 'transparent',
                        color: docCategoryFilter === cat ? '#000000' : '#ffffff',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {cat === 'ALL' ? 'All Document Folders' : cat}
                    </button>
                  ))}
                </div>

                {/* Form: Upload & Classify New Document */}
                <form onSubmit={handleAddDocument} style={{ background: '#18181c', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', marginBottom: '1.75rem' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
                    + Upload & Classify Document to Vault
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', alignItems: 'end' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>Document Name / Title</label>
                      <input
                        type="text"
                        value={newDocTitle}
                        onChange={(e) => setNewDocTitle(e.target.value)}
                        placeholder="e.g. Civil Marriage License..."
                        className="form-input"
                        style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', background: '#121214', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>Classify Folder</label>
                      <select
                        value={newDocCategory}
                        onChange={(e) => setNewDocCategory(e.target.value)}
                        className="form-select"
                        style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', background: '#121214', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
                      >
                        <option value="Legal & Marriage">Legal & Marriage</option>
                        <option value="Hotel & Travel">Hotel & Travel</option>
                        <option value="Vendor Receipts">Vendor Receipts</option>
                        <option value="Personal & Notes">Personal & Notes</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>Select File (Device)</label>
                      <label style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        background: 'rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        padding: '0.5rem 0.8rem',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        border: '1px solid rgba(255,255,255,0.2)',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}>
                        <Upload size={14} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {newDocFileName || 'Choose File...'}
                        </span>
                        <input type="file" onChange={handleDocumentFileUpload} style={{ display: 'none' }} />
                      </label>
                    </div>

                    <button type="submit" className="btn-primary btn-sm" style={{ background: '#ffffff', color: '#000000', border: 'none', fontWeight: 700, padding: '0.55rem 1.25rem' }}>
                      <Plus size={15} /> Save to Vault
                    </button>
                  </div>
                </form>

                {/* Classified Documents Grid */}
                {documents.filter(d => docCategoryFilter === 'ALL' || d.category === docCategoryFilter).length === 0 ? (
                  <div style={{ padding: '2.5rem', textAlign: 'center', background: '#18181c', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px', color: 'rgba(255,255,255,0.5)' }}>
                    No classified dossier documents stored yet. Use the form above to upload & classify your first document!
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {documents
                      .filter(d => docCategoryFilter === 'ALL' || d.category === docCategoryFilter)
                      .map(doc => (
                      <div key={doc.id} style={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px', padding: '1.25rem', position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={20} style={{ color: '#ffffff' }} />
                            <div>
                              <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{doc.title}</h4>
                              <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                {doc.category}
                              </span>
                            </div>
                          </div>

                          <button onClick={() => handleDeleteDocument(doc.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', margin: '0.5rem 0 1rem 0', lineHeight: 1.4 }}>
                          {doc.notes}
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.6rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                          <span>{doc.fileName}</span>
                          <a href={`#download-${doc.id}`} onClick={(e) => { e.preventDefault(); alert(`Downloading ${doc.fileName}`); }} style={{ color: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none', fontWeight: 600 }}>
                            <Download size={12} /> Download
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FEATURE VIEW 5: SHARED COUPLE TASKS */}
            {activeTab === 'SHARED' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontStyle: 'normal', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                      Couple Tasks & Checklists
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', margin: '0.2rem 0 0 0' }}>
                      Shared dual-signed couple tasks for Manzi & Nikita.
                    </p>
                  </div>
                </div>

                <div>
                  {filteredSharedTodos.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                      No shared tasks recorded for this date.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {filteredSharedTodos.map((todo) => (
                        <div
                          key={todo.id}
                          style={{
                            background: '#18181c',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '14px',
                            padding: '1rem 1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '1rem',
                            flexWrap: 'wrap'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', flex: 1 }}>
                            <button
                              onClick={() => onToggleTodo(todo.id, 'SHARED')}
                              className={`custom-checkbox ${todo.completed ? 'checked' : ''}`}
                              style={{ marginTop: '0.2rem', flexShrink: 0 }}
                            >
                              {todo.completed && <CheckCircle2 size={15} />}
                            </button>

                            <div>
                              <div style={{ fontSize: '0.98rem', fontWeight: 600, color: todo.completed ? 'rgba(255,255,255,0.4)' : '#ffffff', textDecoration: todo.completed ? 'line-through' : 'none' }}>
                                {todo.task}
                              </div>

                              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span>{todo.dayLabel}</span>
                                <span>•</span>
                                <span style={{ padding: '0.1rem 0.5rem', fontSize: '0.65rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  {todo.category}
                                </span>
                              </div>

                              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <span style={{
                                  fontSize: '0.75rem',
                                  padding: '0.2rem 0.6rem',
                                  borderRadius: '6px',
                                  background: todo.signedByManzi ? '#2d2d32' : 'rgba(255,255,255,0.08)',
                                  color: '#ffffff',
                                  border: todo.signedByManzi ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.15)',
                                  fontWeight: 700
                                }}>
                                  Manzi: {todo.signedByManzi ? '[Signed]' : 'Pending'}
                                </span>

                                <span style={{
                                  fontSize: '0.75rem',
                                  padding: '0.2rem 0.6rem',
                                  borderRadius: '6px',
                                  background: todo.signedByNikita ? '#38383e' : 'rgba(255,255,255,0.08)',
                                  color: '#ffffff',
                                  border: todo.signedByNikita ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.15)',
                                  fontWeight: 700
                                }}>
                                  Nikita: {todo.signedByNikita ? '[Signed]' : 'Pending'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="no-print">
                            {currentUser === 'MANZI' && !todo.signedByManzi && (
                              <button
                                onClick={() => onSignTodo(todo.id, 'MANZI')}
                                className="btn-sm"
                                style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem', background: '#ffffff', color: '#000000', border: 'none', borderRadius: '20px', fontWeight: 700 }}
                              >
                                <FileSignature size={13} /> Sign as Manzi
                              </button>
                            )}

                            {currentUser === 'NIKITA' && !todo.signedByNikita && (
                              <button
                                onClick={() => onSignTodo(todo.id, 'NIKITA')}
                                className="btn-sm"
                                style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem', background: '#ffffff', color: '#000000', border: 'none', borderRadius: '20px', fontWeight: 700 }}
                              >
                                <FileSignature size={13} /> Sign as Nikita
                              </button>
                            )}

                            <button
                              onClick={() => onDeleteTodo(todo.id, 'SHARED')}
                              className="btn-outline btn-sm"
                              style={{ padding: '0.25rem 0.5rem', color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)' }}
                              title="Delete task"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FEATURE VIEW 6: DATE & MEETING INVITATIONS */}
            {activeTab === 'MEETINGS' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontStyle: 'normal', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                      Date &amp; Meeting Invitations
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', margin: '0.2rem 0 0 0' }}>
                      Schedule dates and planning meetings with your partner. Accepting automatically adds the date to your timeline!
                    </p>
                  </div>
                </div>

                {/* Info Guide Card explaining cross-account features */}
                <div style={{
                  background: '#18181c',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  marginBottom: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={16} style={{ color: '#ffffff' }} /> How Shared Tasks &amp; Meeting Invites Work Across Accounts
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.75)', margin: 0, lineHeight: 1.5 }}>
                    1. <strong>Shared Couple Tasks:</strong> When logged in as Manzi or Nikita, any task added under Shared Couple Tasks is visible to both. You can both sign off on tasks to confirm agreement.<br />
                    2. <strong>Meeting &amp; Date Requests:</strong> Schedule a date, dinner, or meeting below. Your partner will see the invite on their account and can click <strong>Accept Date</strong> (which places it directly onto your timeline calendar!), <strong>Postpone / New Time</strong>, or <strong>Decline</strong>.
                  </p>
                </div>

                {/* Form: Propose / Schedule New Date or Meeting */}
                <form onSubmit={handleCreateMeetingSubmit} style={{ background: '#18181c', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', marginBottom: '1.75rem' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
                    + Schedule a Date or Meeting with {currentUser === 'MANZI' ? 'Nikita' : currentUser === 'NIKITA' ? 'Manzi' : 'Partner'}
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>Meeting / Date Title</label>
                      <input
                        type="text"
                        value={meetTitle}
                        onChange={(e) => setMeetTitle(e.target.value)}
                        placeholder="e.g. Dinner Date at Canoe..."
                        className="form-input"
                        style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', background: '#121214', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>Date</label>
                      <select
                        value={meetDate}
                        onChange={(e) => setMeetDate(e.target.value)}
                        className="form-select"
                        style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', background: '#121214', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
                      >
                        <option value="2026-10-14">Wed Oct 14 - Arrival &amp; Check-in</option>
                        <option value="2026-10-15">Thu Oct 15 - Civil Marriage Day</option>
                        <option value="2026-10-16">Fri Oct 16 - Post-Wedding Dinner</option>
                        <option value="2026-10-17">Sat Oct 17 - Roadtrip Departure</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>Time</label>
                      <input
                        type="text"
                        value={meetTime}
                        onChange={(e) => setMeetTime(e.target.value)}
                        placeholder="e.g. 07:00 PM"
                        className="form-input"
                        style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', background: '#121214', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>Location</label>
                      <input
                        type="text"
                        value={meetLocation}
                        onChange={(e) => setMeetLocation(e.target.value)}
                        placeholder="e.g. King St Airbnb / Canoe Restaurant"
                        className="form-input"
                        style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', background: '#121214', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '0.75rem' }}>
                    <label className="form-label" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>Notes &amp; Details</label>
                    <textarea
                      value={meetNotes}
                      onChange={(e) => setMeetNotes(e.target.value)}
                      placeholder="Add any specific details or notes for your partner..."
                      rows={2}
                      className="form-input"
                      style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', background: '#121214', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)', width: '100%', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                    <button type="submit" className="btn-primary btn-sm" style={{ background: '#ffffff', color: '#000000', border: 'none', fontWeight: 700, padding: '0.55rem 1.35rem' }}>
                      <Send size={14} /> Send Meeting Invitation
                    </button>
                  </div>
                </form>

                {/* List of Invites */}
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff', marginBottom: '1rem' }}>
                    Date &amp; Meeting Requests ({meetingRequests.length})
                  </h4>

                  {meetingRequests.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', background: '#18181c', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px', color: 'rgba(255,255,255,0.5)' }}>
                      No meeting requests scheduled yet. Create one above!
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {meetingRequests.map((req) => {
                        const isRecipient = currentUser === req.to || currentUser === 'GUEST';

                        return (
                          <div
                            key={req.id}
                            style={{
                              background: '#18181c',
                              border: req.status === 'ACCEPTED' ? '1px solid rgba(34, 197, 94, 0.4)' : req.status === 'POSTPONED' ? '1px solid rgba(234, 179, 8, 0.4)' : '1px solid rgba(255, 255, 255, 0.18)',
                              borderRadius: '14px',
                              padding: '1.25rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                                    {req.title}
                                  </h4>
                                  <span style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    padding: '0.15rem 0.55rem',
                                    borderRadius: '10px',
                                    background: req.status === 'ACCEPTED' ? '#15803d' : req.status === 'POSTPONED' ? '#a16207' : req.status === 'DECLINED' ? '#b91c1c' : '#374151',
                                    color: '#ffffff',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em'
                                  }}>
                                    {req.status}
                                  </span>
                                </div>

                                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginTop: '0.4rem' }}>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <CalendarIcon size={13} /> {req.dayLabel || req.date}
                                  </span>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Clock size={13} /> {req.time}
                                  </span>
                                  {req.location && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                      <MapPin size={13} /> {req.location}
                                    </span>
                                  )}
                                  <span>• From: <strong>{req.from}</strong> → To: <strong>{req.to}</strong></span>
                                </div>
                              </div>

                              {/* Action buttons for recipient */}
                              {req.status === 'PENDING' && isRecipient && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                  <button
                                    onClick={() => onRespondMeetingRequest(req.id, 'ACCEPTED')}
                                    className="btn-primary btn-sm"
                                    style={{ background: '#22c55e', color: '#ffffff', border: 'none', fontWeight: 700, padding: '0.4rem 0.9rem', fontSize: '0.78rem' }}
                                  >
                                    <Check size={14} /> Accept Date
                                  </button>

                                  <button
                                    onClick={() => {
                                      const newT = prompt('Propose new time / date:', req.time);
                                      if (newT) {
                                        onRespondMeetingRequest(req.id, 'POSTPONED', newT);
                                      }
                                    }}
                                    className="btn-outline btn-sm"
                                    style={{ color: '#eab308', borderColor: 'rgba(234, 179, 8, 0.4)', padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                                  >
                                    <Clock size={14} /> Postpone / New Time
                                  </button>

                                  <button
                                    onClick={() => onRespondMeetingRequest(req.id, 'DECLINED')}
                                    className="btn-outline btn-sm"
                                    style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)', padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                                  >
                                    <XCircle size={14} /> Decline
                                  </button>
                                </div>
                              )}
                            </div>

                            {req.notes && (
                              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', margin: '0.5rem 0 0 0', background: '#121214', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {req.notes}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* SEPTEMBER & OCTOBER 2026 SCHEDULED CIVIL EVENTS & CALENDAR GRID */}
          {renderMonthsCalendar()}

        </div>

      </div>
    </section>
  );
}
