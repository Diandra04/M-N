import React, { useState } from 'react';
import {
  Lock, Plus, Trash2, Key, CheckCircle2, FileSignature,
  Users, Calendar as CalendarIcon, DollarSign, Calculator, Folder, Upload, Download, FileText, Check, Heart, Save, Sparkles, Clock, MapPin, Send, XCircle, ArrowLeft
} from 'lucide-react';

export function SecretVault({
  currentUser,
  events = [],
  sharedTodos = [],
  vows = '',
  personalNotes: personalNotesProp = '',
  guestList: guestListProp = [],
  budgetPlanner: budgetPlannerProp = { totalBudget: 10000, expenses: [] },
  documentVault: documentVaultProp = [],
  meetingRequests = [],
  onCreateMeetingRequest,
  onRespondMeetingRequest,
  onSaveVows,
  onSavePersonalNotes,
  onSaveGuestList,
  onSaveBudget,
  onSaveDocuments,
  onAddTodo,
  onToggleTodo,
  onSignTodo,
  onDeleteTodo,
  onOpenLoginModal
}) {
  const [activeTab, setActiveTab] = useState(null); // null | 'VOWS' | 'MEETINGS' | 'GUESTS' | 'BUDGET' | 'DOCUMENTS' | 'SHARED' | 'NOTES'
  const [dateFilter, setDateFilter] = useState('ALL');
  const [calendarPersonFilter, setCalendarPersonFilter] = useState('ALL'); // 'ALL' | 'NIKITA' | 'MANZI' | 'BOTH'

  const handleTabSelect = (tabKey) => {
    setActiveTab(tabKey);
    setTimeout(() => {
      const el = document.getElementById('active-hub-tool');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleBackToHub = () => {
    setActiveTab(null);
    setTimeout(() => {
      const el = document.getElementById('vault-hub-top');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const [localVows, setLocalVows] = useState(vows);
  const [vowsSaveStatus, setVowsSaveStatus] = useState('');

  React.useEffect(() => {
    setLocalVows(vows);
  }, [vows]);

  const [guestList, setGuestListLocal] = useState(guestListProp);
  React.useEffect(() => { setGuestListLocal(guestListProp); }, [guestListProp]);
  const setGuestList = (updater) => {
    setGuestListLocal(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (onSaveGuestList) onSaveGuestList(next);
      return next;
    });
  };
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestAmount, setNewGuestAmount] = useState('');
  const [newGuestRsvp, setNewGuestRsvp] = useState('Attending');
  const [newGuestNotes, setNewGuestNotes] = useState('');
  const [isGuestFormOpen, setIsGuestFormOpen] = useState(false);

  const [totalBudget, setTotalBudgetLocal] = useState(budgetPlannerProp.totalBudget ?? 10000);
  const [expenses, setExpensesLocal] = useState(budgetPlannerProp.expenses || []);
  React.useEffect(() => {
    setTotalBudgetLocal(budgetPlannerProp.totalBudget ?? 10000);
    setExpensesLocal(budgetPlannerProp.expenses || []);
  }, [budgetPlannerProp]);
  const setTotalBudget = (updater) => {
    setTotalBudgetLocal(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (onSaveBudget) onSaveBudget({ totalBudget: next, expenses });
      return next;
    });
  };
  const setExpenses = (updater) => {
    setExpensesLocal(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (onSaveBudget) onSaveBudget({ totalBudget, expenses: next });
      return next;
    });
  };
  const [newExpenseItem, setNewExpenseItem] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('Dining');
  const [newExpenseEst, setNewExpenseEst] = useState('');
  const [newExpenseActual, setNewExpenseActual] = useState('');
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);

  const [docCategoryFilter, setDocCategoryFilter] = useState('ALL');
  const [documents, setDocumentsLocal] = useState(documentVaultProp);
  React.useEffect(() => { setDocumentsLocal(documentVaultProp); }, [documentVaultProp]);
  const setDocuments = (updater) => {
    setDocumentsLocal(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (onSaveDocuments) onSaveDocuments(next);
      return next;
    });
  };
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('Legal & Marriage');
  const [newDocNotes, setNewDocNotes] = useState('');
  const [newDocFileName, setNewDocFileName] = useState('');
  const [isDocFormOpen, setIsDocFormOpen] = useState(false);

  const [meetTitle, setMeetTitle] = useState('');
  const [meetDate, setMeetDate] = useState('2026-10-14');
  const [meetTime, setMeetTime] = useState('07:00 PM');
  const [meetLocation, setMeetLocation] = useState('King Street West Airbnb');
  const [meetNotes, setMeetNotes] = useState('');
  const [isMeetingFormOpen, setIsMeetingFormOpen] = useState(false);

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

  const [newTask, setNewTask] = useState('');
  const [newDate, setNewDate] = useState('2026-10-15');
  const [newCategory, setNewCategory] = useState('Civil Ceremony');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  const handleAddSharedTaskSubmit = (e) => {
    e.preventDefault();
    if (!newTask.trim() || !onAddTodo) return;
    const dayLabel = newDate === '2026-10-14' ? 'Wednesday, Oct 14' 
      : newDate === '2026-10-15' ? 'Thursday, Oct 15' 
      : newDate === '2026-10-16' ? 'Friday, Oct 16' 
      : newDate === '2026-10-17' ? 'Saturday, Oct 17' 
      : newDate;

    onAddTodo({
      id: 'task-' + Date.now(),
      task: newTask.trim(),
      date: newDate,
      dayLabel,
      category: newCategory,
      completed: false,
      signedByManzi: isManzi,
      signedByNikita: isNikita,
      listType: 'SHARED'
    });

    setNewTask('');
  };

  const [calendarViewMode, setCalendarViewMode] = useState('OCTOBER'); // 'OCTOBER' | 'SEPTEMBER'

  const [notesViewMode, setNotesViewMode] = useState('EDITOR'); // 'EDITOR' | 'CHECKLIST'

  const [personalNotes, setPersonalNotesLocal] = useState(personalNotesProp);

  React.useEffect(() => {
    setPersonalNotesLocal(personalNotesProp);
  }, [personalNotesProp]);

  const handleSaveNoteContent = (val) => {
    setPersonalNotesLocal(val);
    if (onSavePersonalNotes) onSavePersonalNotes(val);
  };

  const [newChecklistItem, setNewChecklistItem] = useState('');

  const handleAddChecklistItem = (e) => {
    e.preventDefault();
    if (!newChecklistItem.trim()) return;
    const currentText = personalNotes.trim();
    const formattedItem = `[ ] ${newChecklistItem.trim()}`;
    const newText = currentText ? `${currentText}\n${formattedItem}` : formattedItem;
    handleSaveNoteContent(newText);
    setNewChecklistItem('');
  };

  const handleToggleCheckline = (lineIndex) => {
    const lines = personalNotes.split('\n');
    if (lineIndex < 0 || lineIndex >= lines.length) return;
    let line = lines[lineIndex];
    const trimmed = line.trim();
    if (trimmed.startsWith('[ ]')) {
      lines[lineIndex] = line.replace('[ ]', '[x]');
    } else if (trimmed.startsWith('[x]') || trimmed.startsWith('[X]')) {
      lines[lineIndex] = line.replace(/\[[xX]\]/, '[ ]');
    } else {
      lines[lineIndex] = `[x] ${line}`;
    }
    handleSaveNoteContent(lines.join('\n'));
  };

  const handleDeleteCheckline = (lineIndex) => {
    const lines = personalNotes.split('\n');
    lines.splice(lineIndex, 1);
    handleSaveNoteContent(lines.join('\n'));
  };

  const parsedNoteLines = personalNotes
    .split('\n')
    .map((line, idx) => {
      const trimmed = line.trim();
      const isChecked = trimmed.startsWith('[x]') || trimmed.startsWith('[X]');
      const isUnchecked = trimmed.startsWith('[ ]');
      const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*');
      
      let text = line;
      if (isChecked) text = line.replace(/^\[[xX]\]\s*/, '');
      else if (isUnchecked) text = line.replace(/^\[ \]\s*/, '');
      else if (isBullet) text = line.replace(/^[•\-*]\s*/, '');

      return {
        originalIndex: idx,
        line,
        trimmed,
        isCheckable: isChecked || isUnchecked || isBullet || trimmed.length > 0,
        isChecked,
        isBullet,
        text
      };
    })
    .filter(item => item.trimmed.length > 0);

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
  // only Manzi/Nikita can write to the shared doc, so hide add/edit/delete for anyone else
  const canEdit = isManzi || isNikita;

  const eventsByDate = events.reduce((acc, evt) => {
    if (!evt || !evt.date) return acc;
    let key = evt.date;

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

  const filteredSharedTodos = dateFilter === 'ALL'
    ? sharedTodos 
    : sharedTodos.filter(t => t.date === dateFilter);

  const totalRestoCollected = guestList.reduce((sum, g) => sum + (g.contributed ? Number(g.amount || 0) : 0), 0);
  const totalAttendingGuests = guestList.filter(g => g.rsvp === 'Attending').length;

  const totalActualSpent = expenses.reduce((sum, e) => sum + Number(e.actual || 0), 0);
  const remainingBudgetLeft = totalBudget - totalActualSpent;

  const handleSaveVowsSubmit = (e) => {
    if (e) e.preventDefault();
    if (isManzi || isNikita) {
      if (onSaveVows) onSaveVows(localVows);
      setVowsSaveStatus(`${isManzi ? "Manzi's" : "Nikita's"} vows saved securely!`);
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

  const handleChangeGuestRsvp = (guestId, rsvp) => {
    setGuestList(prev => prev.map(g => (g.id === guestId ? { ...g, rsvp } : g)));
  };

  const handleDeleteGuest = (guestId) => {
    setGuestList(prev => prev.filter(g => g.id !== guestId));
  };

  const getRsvpColors = (rsvp) => {
    if (rsvp === 'Attending') return { color: '#a3c9a8', bg: 'rgba(163, 201, 168, 0.12)', border: 'rgba(163, 201, 168, 0.3)' };
    if (rsvp === 'Declined') return { color: '#c99a9a', bg: 'rgba(201, 154, 154, 0.12)', border: 'rgba(201, 154, 154, 0.3)' };
    return { color: '#d9b98a', bg: 'rgba(217, 185, 138, 0.12)', border: 'rgba(217, 185, 138, 0.3)' };
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
        boxShadow: '0 16px 40px rgba(0,0,0,0.6)'
      }}>
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

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          flexWrap: 'wrap',
          marginBottom: '1.25rem'
        }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.68rem', fontWeight: 700 }}>
            Filter
          </span>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2rem',
            padding: '0.25rem',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '999px',
            flexWrap: 'wrap'
          }}>
            {[
              { key: 'ALL', label: 'All', color: '#ffffff', textColor: '#000000' },
              { key: 'NIKITA', label: 'Nikita', color: '#e08298', textColor: '#ffffff' },
              { key: 'MANZI', label: 'Manzi', color: '#8B5E3C', textColor: '#ffffff' },
              { key: 'BOTH', label: 'Both', color: '#588157', textColor: '#ffffff' },
            ].map(f => {
              const active = calendarPersonFilter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setCalendarPersonFilter(f.key)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '999px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    background: active ? f.color : 'transparent',
                    color: active ? f.textColor : 'rgba(255,255,255,0.65)',
                    boxShadow: active ? '0 2px 10px rgba(0,0,0,0.35)' : 'none',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

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
              const rawEvents = eventsByDate[dateKey] || [];
              const dayEvents = rawEvents.filter(evt => {
                if (calendarPersonFilter === 'ALL') return true;
                const theme = getEventTheme(evt);
                if (calendarPersonFilter === 'NIKITA') return theme.label === 'Nikita';
                if (calendarPersonFilter === 'MANZI') return theme.label === 'Manzi';
                if (calendarPersonFilter === 'BOTH') return theme.label === 'Both';
                return true;
              });
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

                <div className="vault-cal-grid" style={{
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

                <div className="vault-cal-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '0.35rem'
                }}>
                  {padding.map((_, idx) => (
                    <div key={`pad-${cfg.yearMonthKey}-${idx}`} className="vault-cal-cell" style={{ minHeight: '65px', minWidth: 0, background: 'transparent' }} />
                  ))}

                  {days.map((d) => (
                    <div
                      key={d.dateKey}
                      onClick={() => setDateFilter(d.isSelected ? 'ALL' : d.dateKey)}
                      className="vault-cal-cell"
                      style={{
                        minHeight: '65px',
                        minWidth: 0,
                        overflow: 'hidden',
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
        
        <div className="vault-hub" style={{
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
          
          <div id="vault-hub-top" style={{
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
          </div>

          {!activeTab && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.1rem',
            marginBottom: '2.5rem'
          }}>
            <div 
              onClick={() => handleTabSelect('VOWS')}
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
                {isManzi ? "Manzi's Vows Unlocked" : isNikita ? "Nikita's Vows Unlocked" : "Sign In to Unlock"} →
              </div>
            </div>

            <div 
              onClick={() => handleTabSelect('GUESTS')}
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

            <div 
              onClick={() => handleTabSelect('BUDGET')}
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

            <div 
              onClick={() => handleTabSelect('DOCUMENTS')}
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

            <div 
              onClick={() => handleTabSelect('SHARED')}
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

            <div 
              onClick={() => handleTabSelect('MEETINGS')}
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

            <div 
              onClick={() => handleTabSelect('NOTES')}
              style={{
                background: activeTab === 'NOTES' 
                  ? 'linear-gradient(135deg, #3A2510 0%, #5C3A16 100%)' 
                  : 'linear-gradient(135deg, #24170A 0%, #190F06 100%)',
                color: '#ffffff',
                border: activeTab === 'NOTES' ? '2px solid #FB8C00' : '1px solid rgba(251, 140, 0, 0.35)',
                borderRadius: '18px',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeTab === 'NOTES' ? '0 10px 28px rgba(251, 140, 0, 0.3)' : '0 4px 12px rgba(0,0,0,0.2)',
                transform: activeTab === 'NOTES' ? 'translateY(-3px)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '135px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <FileText size={22} style={{ color: '#FFB74D' }} />
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    background: '#EF6C00',
                    color: '#ffffff',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}>
                    NOTES
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0.65rem 0 0.2rem 0', fontFamily: 'var(--font-serif)', fontStyle: 'normal', color: '#ffffff' }}>
                  Personal Note Pad
                </h3>
                <p style={{ fontSize: '0.78rem', margin: 0, color: 'rgba(255, 255, 255, 0.75)' }}>
                  Private notepad &amp; freeform lists
                </p>
              </div>

              <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '0.85rem', borderTop: '1px solid rgba(251, 140, 0, 0.25)', paddingTop: '0.5rem', color: '#FFE0B2' }}>
                Auto-saved to {currentUser || 'Guest'} →
              </div>
            </div>

            <div
              onClick={() => handleTabSelect('CALENDAR')}
              style={{
                background: activeTab === 'CALENDAR'
                  ? 'linear-gradient(135deg, #232A4D 0%, #333D6E 100%)'
                  : 'linear-gradient(135deg, #171B30 0%, #0F1220 100%)',
                color: '#ffffff',
                border: activeTab === 'CALENDAR' ? '2px solid #7986CB' : '1px solid rgba(121, 134, 203, 0.35)',
                borderRadius: '18px',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeTab === 'CALENDAR' ? '0 10px 28px rgba(121, 134, 203, 0.3)' : '0 4px 12px rgba(0,0,0,0.2)',
                transform: activeTab === 'CALENDAR' ? 'translateY(-3px)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '135px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <CalendarIcon size={22} style={{ color: '#9FA8DA' }} />
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    background: '#3F51B5',
                    color: '#ffffff',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}>
                    CALENDAR
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0.65rem 0 0.2rem 0', fontFamily: 'var(--font-serif)', fontStyle: 'normal', color: '#ffffff' }}>
                  Civil Wedding Calendar
                </h3>
                <p style={{ fontSize: '0.78rem', margin: 0, color: 'rgba(255, 255, 255, 0.75)' }}>
                  Full Sept &amp; Oct 2026 monthly view
                </p>
              </div>

              <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '0.85rem', borderTop: '1px solid rgba(121, 134, 203, 0.25)', paddingTop: '0.5rem', color: '#C5CAE9' }}>
                {events.length} scheduled events →
              </div>
            </div>
          </div>
          )}

          {activeTab && (
          <div id="active-hub-tool" className="vault-panel" style={{ background: '#121214', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', padding: '2rem' }}>

            <button
              onClick={handleBackToHub}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                padding: '0.6rem 1.3rem',
                borderRadius: '30px',
                border: 'none',
                background: '#ffffff',
                color: '#111111',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
            >
              <ArrowLeft size={15} /> Back to Hub
            </button>

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
                          value={localVows}
                          onChange={(e) => setLocalVows(e.target.value)}
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
                            {localVows.trim().split(/\s+/).filter(Boolean).length} words • Private to Manzi (Sealed from Nikita)
                          </span>
                          <button type="submit" className="btn-primary btn-sm" style={{ background: '#ffffff', color: '#000000', border: 'none', fontWeight: 700, padding: '0.55rem 1.35rem' }}>
                            <Save size={14} /> Save Manzi's Vows
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : isNikita ? (
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
                          value={localVows}
                          onChange={(e) => setLocalVows(e.target.value)}
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
                            {localVows.trim().split(/\s+/).filter(Boolean).length} words • Private to Nikita (Sealed from Manzi)
                          </span>
                          <button type="submit" className="btn-primary btn-sm" style={{ background: '#ffffff', color: '#000000', border: 'none', fontWeight: 700, padding: '0.55rem 1.35rem' }}>
                            <Save size={14} /> Save Nikita's Vows
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : (
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
                      Sign in to view and edit your private wedding vows. Vows remain strictly private until the ceremony!
                    </p>
                    <button
                      onClick={() => onOpenLoginModal()}
                      className="btn-primary"
                      style={{ background: '#ffffff', color: '#000000', border: 'none', fontWeight: 700, padding: '0.75rem 1.75rem', borderRadius: '30px', fontSize: '0.95rem' }}
                    >
                      <Key size={16} /> Sign In
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'GUESTS' && (
              <div>
                <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontStyle: 'normal', color: '#ffffff', marginBottom: '1.25rem', fontWeight: 600 }}>
                  Resto Money & Guest List Tracker
                </h3>

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

                {!canEdit ? null : !isGuestFormOpen ? (
                  <button
                    type="button"
                    onClick={() => setIsGuestFormOpen(true)}
                    className="btn-outline btn-sm"
                    style={{ marginBottom: '1.75rem', borderColor: 'rgba(255,255,255,0.25)', color: '#ffffff' }}
                  >
                    <Plus size={14} /> Add Guest
                  </button>
                ) : (
                <form onSubmit={handleAddGuest} style={{ background: '#18181c', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', marginBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', margin: 0 }}>
                      Add Guest
                    </h4>
                    <button type="button" onClick={() => setIsGuestFormOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex' }}>
                      <XCircle size={18} />
                    </button>
                  </div>

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
                )}

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
                            <select
                              value={g.rsvp}
                              onChange={(e) => handleChangeGuestRsvp(g.id, e.target.value)}
                              disabled={!canEdit}
                              style={{
                                padding: '0.25rem 1.6rem 0.25rem 0.65rem',
                                borderRadius: '20px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                cursor: canEdit ? 'pointer' : 'default',
                                border: `1px solid ${getRsvpColors(g.rsvp).border}`,
                                background: getRsvpColors(g.rsvp).bg,
                                color: getRsvpColors(g.rsvp).color,
                                appearance: 'auto'
                              }}
                            >
                              <option value="Attending">Attending</option>
                              <option value="Pending">Pending</option>
                              <option value="Declined">Declined</option>
                            </select>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>${g.amount || 0}</td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <button
                              onClick={() => handleToggleGuestContribution(g.id)}
                              disabled={!canEdit}
                              style={{
                                padding: '0.25rem 0.65rem',
                                borderRadius: '20px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                cursor: canEdit ? 'pointer' : 'default',
                                border: `1px solid ${g.contributed ? 'rgba(163, 201, 168, 0.3)' : 'rgba(201, 154, 154, 0.3)'}`,
                                background: g.contributed ? 'rgba(163, 201, 168, 0.12)' : 'rgba(201, 154, 154, 0.12)',
                                color: g.contributed ? '#a3c9a8' : '#c99a9a'
                              }}
                            >
                              {g.contributed ? 'Paid' : 'Not Paid'}
                            </button>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>{g.notes}</td>
                          <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                            {canEdit && (
                              <button onClick={() => handleDeleteGuest(g.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}>
                                <Trash2 size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'BUDGET' && (
              <div>
                <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontStyle: 'normal', color: '#ffffff', marginBottom: '1.25rem', fontWeight: 600 }}>
                  Budget & Expense Calculator
                </h3>

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

                {!canEdit ? null : !isExpenseFormOpen ? (
                  <button
                    type="button"
                    onClick={() => setIsExpenseFormOpen(true)}
                    className="btn-outline btn-sm"
                    style={{ marginBottom: '1.75rem', borderColor: 'rgba(255,255,255,0.25)', color: '#ffffff' }}
                  >
                    <Plus size={14} /> Add Expense
                  </button>
                ) : (
                <form onSubmit={handleAddExpense} style={{ background: '#18181c', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', marginBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', margin: 0 }}>
                      Add Expense
                    </h4>
                    <button type="button" onClick={() => setIsExpenseFormOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex' }}>
                      <XCircle size={18} />
                    </button>
                  </div>

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
                )}

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
                              {canEdit && (
                                <button onClick={() => handleDeleteExpense(e.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}>
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      }))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'DOCUMENTS' && (
              <div>
                <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontStyle: 'normal', color: '#ffffff', marginBottom: '1.25rem', fontWeight: 600 }}>
                  Classified Digital Dossier & Files
                </h3>

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

                {!canEdit ? null : !isDocFormOpen ? (
                  <button
                    type="button"
                    onClick={() => setIsDocFormOpen(true)}
                    className="btn-outline btn-sm"
                    style={{ marginBottom: '1.75rem', borderColor: 'rgba(255,255,255,0.25)', color: '#ffffff' }}
                  >
                    <Plus size={14} /> Add Document
                  </button>
                ) : (
                <form onSubmit={handleAddDocument} style={{ background: '#18181c', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', marginBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', margin: 0 }}>
                      Add Document
                    </h4>
                    <button type="button" onClick={() => setIsDocFormOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex' }}>
                      <XCircle size={18} />
                    </button>
                  </div>

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
                )}

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

                          {canEdit && (
                            <button onClick={() => handleDeleteDocument(doc.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}>
                              <Trash2 size={13} />
                            </button>
                          )}
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

                {!canEdit ? null : !isTaskFormOpen ? (
                  <button
                    type="button"
                    onClick={() => setIsTaskFormOpen(true)}
                    className="btn-outline btn-sm"
                    style={{ marginBottom: '1.75rem', borderColor: 'rgba(255,255,255,0.25)', color: '#ffffff' }}
                  >
                    <Plus size={14} /> Add New Shared Task
                  </button>
                ) : (
                <form onSubmit={handleAddSharedTaskSubmit} style={{ background: '#18181c', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', marginBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', margin: 0 }}>
                      + Type &amp; Add New Shared Task to Couple Checklist
                    </h4>
                    <button type="button" onClick={() => setIsTaskFormOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex' }}>
                      <XCircle size={18} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', alignItems: 'end' }}>
                    <div style={{ flex: 2 }}>
                      <label className="form-label" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>Task Description</label>
                      <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Type task (e.g. Confirm Marriage Witness signatures)..."
                        className="form-input"
                        style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', background: '#121214', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>Target Date</label>
                      <select
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="form-select"
                        style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', background: '#121214', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
                      >
                        <option value="2026-10-14">Wed Oct 14 - Check-in &amp; Marriage Prep</option>
                        <option value="2026-10-15">Thu Oct 15 - Civil Marriage Day</option>
                        <option value="2026-10-16">Fri Oct 16 - Post-Wedding Dinner</option>
                        <option value="2026-10-17">Sat Oct 17 - Roadtrip Departure</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>Category</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="form-select"
                        style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', background: '#121214', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
                      >
                        <option value="Civil Ceremony">Civil Ceremony</option>
                        <option value="Outfits & Grooming">Outfits &amp; Grooming</option>
                        <option value="Dining & Celebration">Dining &amp; Celebration</option>
                        <option value="Photography">Photography</option>
                        <option value="Travel & Airbnb">Travel &amp; Airbnb</option>
                      </select>
                    </div>

                    <button type="submit" className="btn-primary btn-sm" style={{ background: '#ffffff', color: '#000000', border: 'none', fontWeight: 700, padding: '0.55rem 1.25rem' }}>
                      <Plus size={15} /> Add Task
                    </button>
                  </div>
                </form>
                )}

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
                              onClick={canEdit ? () => onToggleTodo(todo.id, 'SHARED') : undefined}
                              disabled={!canEdit}
                              className={`custom-checkbox ${todo.completed ? 'checked' : ''}`}
                              style={{ marginTop: '0.2rem', flexShrink: 0, cursor: canEdit ? 'pointer' : 'default' }}
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

                            {canEdit && (
                              <button
                                onClick={() => onDeleteTodo(todo.id, 'SHARED')}
                                className="btn-outline btn-sm"
                                style={{ padding: '0.25rem 0.5rem', color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)' }}
                                title="Delete task"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

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

                {!canEdit ? null : !isMeetingFormOpen ? (
                  <button
                    type="button"
                    onClick={() => setIsMeetingFormOpen(true)}
                    className="btn-outline btn-sm"
                    style={{ marginBottom: '1.75rem', borderColor: 'rgba(255,255,255,0.25)', color: '#ffffff' }}
                  >
                    <Plus size={14} /> Schedule Meeting
                  </button>
                ) : (
                <form onSubmit={handleCreateMeetingSubmit} style={{ background: '#18181c', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', marginBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', margin: 0 }}>
                      Schedule Meeting
                    </h4>
                    <button type="button" onClick={() => setIsMeetingFormOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex' }}>
                      <XCircle size={18} />
                    </button>
                  </div>

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
                )}

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
                        const isRecipient = canEdit && currentUser === req.to;

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

            {activeTab === 'NOTES' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontStyle: 'normal', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                      {currentUser === 'MANZI' ? "Manzi's Personal Note Pad" : currentUser === 'NIKITA' ? "Nikita's Personal Note Pad" : "Personal Note Pad"}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', margin: '0.2rem 0 0 0' }}>
                      Clean, private notepad isolated per logged-in user account. Auto-saved in real time.
                    </p>
                  </div>

                  <div style={{
                    display: 'inline-flex',
                    background: '#09090b',
                    padding: '0.25rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}>
                    <button
                      onClick={() => setNotesViewMode('CHECKLIST')}
                      style={{
                        padding: '0.4rem 1rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        borderRadius: '9px',
                        border: 'none',
                        cursor: 'pointer',
                        background: notesViewMode === 'CHECKLIST' ? '#ffffff' : 'transparent',
                        color: notesViewMode === 'CHECKLIST' ? '#000000' : 'rgba(255, 255, 255, 0.7)',
                        transition: 'all 0.2s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <CheckCircle2 size={14} /> Interactive Checklist
                    </button>
                    <button
                      onClick={() => setNotesViewMode('EDITOR')}
                      style={{
                        padding: '0.4rem 1rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        borderRadius: '9px',
                        border: 'none',
                        cursor: 'pointer',
                        background: notesViewMode === 'EDITOR' ? '#ffffff' : 'transparent',
                        color: notesViewMode === 'EDITOR' ? '#000000' : 'rgba(255, 255, 255, 0.7)',
                        transition: 'all 0.2s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <FileText size={14} /> Paragraph Editor
                    </button>
                  </div>
                </div>

                {notesViewMode === 'CHECKLIST' ? (
                  <div>
                    <form onSubmit={handleAddChecklistItem} style={{ background: '#18181c', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', marginBottom: '1.5rem' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        + Add New Checklist Item
                      </label>
                      <div className="vault-add-item-row" style={{ display: 'flex', gap: '0.75rem', marginTop: '0.4rem' }}>
                        <input
                          type="text"
                          value={newChecklistItem}
                          onChange={(e) => setNewChecklistItem(e.target.value)}
                          placeholder="Type checklist item (e.g. Bring passport to marriage registry)..."
                          className="form-input"
                          style={{ flex: 1, padding: '0.6rem 0.9rem', fontSize: '0.9rem', background: '#121214', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
                        />
                        <button type="submit" className="btn-primary btn-sm" style={{ background: '#ffffff', color: '#000000', border: 'none', fontWeight: 700, padding: '0.6rem 1.4rem', whiteSpace: 'nowrap' }}>
                          <Plus size={15} /> Add Item
                        </button>
                      </div>
                    </form>

                    {parsedNoteLines.length > 0 && (
                      <div style={{ background: '#18181c', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
                          <span>Checklist Progress</span>
                          <span style={{ color: '#22c55e' }}>
                            {parsedNoteLines.filter(i => i.isChecked).length} / {parsedNoteLines.length} Completed ({Math.round((parsedNoteLines.filter(i => i.isChecked).length / parsedNoteLines.length) * 100)}%)
                          </span>
                        </div>
                        <div style={{ height: '8px', width: '100%', background: '#121214', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${(parsedNoteLines.filter(i => i.isChecked).length / parsedNoteLines.length) * 100}%`,
                            background: 'linear-gradient(90deg, #22c55e, #4ade80)',
                            borderRadius: '4px',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      </div>
                    )}

                    {parsedNoteLines.length === 0 ? (
                      <div style={{ padding: '3rem', textAlign: 'center', background: '#18181c', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '16px', color: 'rgba(255,255,255,0.5)' }}>
                        Your checklist is empty. Add your first item above!
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {parsedNoteLines.map((item) => (
                          <div
                            key={item.originalIndex}
                            style={{
                              background: '#18181c',
                              border: item.isChecked ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.15)',
                              borderRadius: '12px',
                              padding: '0.85rem 1.1rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.85rem',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div
                              onClick={() => handleToggleCheckline(item.originalIndex)}
                              style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, cursor: 'pointer' }}
                            >
                              <div style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                border: item.isChecked ? '2px solid #22c55e' : '2px solid rgba(255, 255, 255, 0.4)',
                                background: item.isChecked ? '#22c55e' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                                flexShrink: 0
                              }}>
                                {item.isChecked && <Check size={14} style={{ color: '#ffffff', strokeWidth: 3 }} />}
                              </div>

                              <span style={{
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                color: item.isChecked ? 'rgba(255, 255, 255, 0.45)' : '#ffffff',
                                textDecoration: item.isChecked ? 'line-through' : 'none',
                                transition: 'all 0.2s ease'
                              }}>
                                {item.text}
                              </span>
                            </div>

                            <button
                              onClick={() => handleDeleteCheckline(item.originalIndex)}
                              style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '0.2rem', opacity: 0.7 }}
                              title="Delete item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '16px', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                        Freeform Text &amp; Notes
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => handleSaveNoteContent(personalNotes + (personalNotes.endsWith('\n') || personalNotes === '' ? '• ' : '\n• '))}
                          className="btn-outline btn-sm"
                          style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}
                        >
                          + Bullet Point
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveNoteContent(personalNotes + (personalNotes.endsWith('\n') || personalNotes === '' ? '[ ] ' : '\n[ ] '))}
                          className="btn-outline btn-sm"
                          style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}
                        >
                          + Checkbox
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={personalNotes}
                      onChange={(e) => handleSaveNoteContent(e.target.value)}
                      onKeyDown={handleNotesKeyDown}
                      placeholder="Type your notes, paragraphs, bullet lists (• ), or checklists ([ ] )..."
                      rows={14}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        background: '#121214',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        color: '#ffffff',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontSize: '1rem',
                        lineHeight: 1.7,
                        resize: 'vertical',
                        outline: 'none'
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
                      <span>Press Enter for automatic bullet/checkbox continuation</span>
                      <span style={{ color: '#22c55e', fontWeight: 600 }}>Auto-saved to {currentUser || 'Guest'} account</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'CALENDAR' && renderMonthsCalendar()}

          </div>
          )}

        </div>

      </div>
    </section>
  );
}
