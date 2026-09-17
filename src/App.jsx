import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ItineraryPlanner } from './components/ItineraryPlanner';
import { SecretVault } from './components/SecretVault';
import { Footer } from './components/Footer';
import { EditDetailsModal } from './components/EditDetailsModal';
import { AddEventModal } from './components/AddEventModal';
import { LoginModal } from './components/LoginModal';
import { getStoredData, saveStoredData, resetStoredData } from './services/storage';

export default function App() {
  const [data, setData] = useState(() => getStoredData());
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('MN_ACTIVE_USER') || 'GUEST';
  }); // 'GUEST' | 'MANZI' | 'NIKITA'
  
  const [isEditDetailsOpen, setIsEditDetailsOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginTargetRole, setLoginTargetRole] = useState('MANZI');
  const [editingEvent, setEditingEvent] = useState(null);

  // Sync data updates to localStorage
  useEffect(() => {
    saveStoredData(data);
  }, [data]);

  // Event handlers
  const handleToggleComplete = (eventId) => {
    setData(prev => ({
      ...prev,
      events: prev.events.map(e => e.id === eventId ? { ...e, completed: !e.completed } : e)
    }));
  };

  const handleDeleteEvent = (eventId) => {
    setData(prev => ({
      ...prev,
      events: prev.events.filter(e => e.id !== eventId)
    }));
  };

  const handleSaveEvent = (savedEvent) => {
    const authorName = currentUser !== 'GUEST' ? currentUser : 'Partner';
    const logEntry = {
      id: 'log-' + Date.now(),
      text: `${authorName} updated "${savedEvent.title}" (${savedEvent.dayLabel} @ ${savedEvent.time})`,
      author: authorName,
      date: 'Just now'
    };

    setData(prev => {
      const exists = prev.events.some(e => e.id === savedEvent.id);
      let updatedEvents;
      if (exists) {
        updatedEvents = prev.events.map(e => e.id === savedEvent.id ? savedEvent : e);
      } else {
        updatedEvents = [...prev.events, savedEvent];
      }

      const updatedDayTitles = {
        ...(prev.dayTitles || {}),
        ...(savedEvent.dateTitle ? { [savedEvent.date]: savedEvent.dateTitle } : {})
      };

      return { 
        ...prev, 
        events: updatedEvents,
        dayTitles: updatedDayTitles,
        itineraryActivityLog: [logEntry, ...(prev.itineraryActivityLog || [])]
      };
    });
    setEditingEvent(null);
  };

  const handleUpdateDayTitle = (dateKey, newTitle) => {
    if (!dateKey) return;
    setData(prev => ({
      ...prev,
      dayTitles: {
        ...(prev.dayTitles || {}),
        [dateKey]: newTitle
      }
    }));
  };

  const handleEditEventClick = (evt) => {
    setEditingEvent(evt);
    setIsAddEventOpen(true);
  };

  const handleOpenAddEventModal = () => {
    setEditingEvent(null);
    setIsAddEventOpen(true);
  };

  const handleSaveDetails = (updated) => {
    setData(prev => ({
      ...prev,
      couple: { ...prev.couple, ...updated.couple },
      tripInfo: { ...prev.tripInfo, ...updated.tripInfo },
    }));
  };

  // Calendar To-Do Planner Handlers
  const handleAddTodo = (newTodo) => {
    if (newTodo.listType === 'PRIVATE') {
      if (currentUser === 'MANZI') {
        setData(prev => ({
          ...prev,
          manziSecretTodos: [newTodo, ...(prev.manziSecretTodos || [])]
        }));
      } else if (currentUser === 'NIKITA') {
        setData(prev => ({
          ...prev,
          nikitaSecretTodos: [newTodo, ...(prev.nikitaSecretTodos || [])]
        }));
      }
    } else {
      setData(prev => ({
        ...prev,
        sharedTodos: [newTodo, ...(prev.sharedTodos || [])]
      }));
    }
  };

  const handleToggleTodo = (todoId, listType) => {
    if (listType === 'PRIVATE') {
      if (currentUser === 'MANZI') {
        setData(prev => ({
          ...prev,
          manziSecretTodos: (prev.manziSecretTodos || []).map(t => t.id === todoId ? { ...t, completed: !t.completed } : t)
        }));
      } else if (currentUser === 'NIKITA') {
        setData(prev => ({
          ...prev,
          nikitaSecretTodos: (prev.nikitaSecretTodos || []).map(t => t.id === todoId ? { ...t, completed: !t.completed } : t)
        }));
      }
    } else {
      setData(prev => ({
        ...prev,
        sharedTodos: (prev.sharedTodos || []).map(t => t.id === todoId ? { ...t, completed: !t.completed } : t)
      }));
    }
  };

  const handleSignTodo = (todoId, role) => {
    const isM = role === 'MANZI';
    const isN = role === 'NIKITA';
    setData(prev => ({
      ...prev,
      sharedTodos: (prev.sharedTodos || []).map(t => {
        if (t.id === todoId) {
          const mSigned = isM ? true : t.signedByManzi;
          const nSigned = isN ? true : t.signedByNikita;
          return {
            ...t,
            signedByManzi: mSigned,
            signedByNikita: nSigned,
            signatureDate: `Signed by ${mSigned && nSigned ? 'Manzi & Nikita' : role}`
          };
        }
        return t;
      })
    }));
  };

  const handleDeleteTodo = (todoId, listType) => {
    if (listType === 'PRIVATE') {
      if (currentUser === 'MANZI') {
        setData(prev => ({
          ...prev,
          manziSecretTodos: (prev.manziSecretTodos || []).filter(t => t.id !== todoId)
        }));
      } else if (currentUser === 'NIKITA') {
        setData(prev => ({
          ...prev,
          nikitaSecretTodos: (prev.nikitaSecretTodos || []).filter(t => t.id !== todoId)
        }));
      }
    } else {
      setData(prev => ({
        ...prev,
        sharedTodos: (prev.sharedTodos || []).filter(t => t.id !== todoId)
      }));
    }
  };

  // Secret Vault Handlers
  const handleSaveVows = (vowsText) => {
    if (currentUser === 'MANZI') {
      setData(prev => ({ ...prev, manziVows: vowsText }));
    } else if (currentUser === 'NIKITA') {
      setData(prev => ({ ...prev, nikitaVows: vowsText }));
    }
  };

  const handleAddSecretNote = (newSecret) => {
    if (currentUser === 'MANZI') {
      setData(prev => ({
        ...prev,
        manziSecretNotes: [newSecret, ...(prev.manziSecretNotes || [])]
      }));
    } else if (currentUser === 'NIKITA') {
      setData(prev => ({
        ...prev,
        nikitaSecretNotes: [newSecret, ...(prev.nikitaSecretNotes || [])]
      }));
    }
  };

  const handleDeleteSecretNote = (secretId) => {
    if (currentUser === 'MANZI') {
      setData(prev => ({
        ...prev,
        manziSecretNotes: (prev.manziSecretNotes || []).filter(s => s.id !== secretId)
      }));
    } else if (currentUser === 'NIKITA') {
      setData(prev => ({
        ...prev,
        nikitaSecretNotes: (prev.nikitaSecretNotes || []).filter(s => s.id !== secretId)
      }));
    }
  };

  const handleCreateMeetingRequest = (requestData) => {
    setData(prev => ({
      ...prev,
      meetingRequests: [requestData, ...(prev.meetingRequests || [])]
    }));
  };

  const handleRespondMeetingRequest = (requestId, status, newTime = null) => {
    setData(prev => {
      const updatedRequests = (prev.meetingRequests || []).map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            status,
            ...(newTime ? { time: newTime } : {})
          };
        }
        return r;
      });

      const req = (prev.meetingRequests || []).find(r => r.id === requestId);
      let updatedEvents = prev.events || [];
      if (req && status === 'ACCEPTED') {
        const newEvent = {
          id: 'evt-meet-' + Date.now(),
          date: req.date,
          dayLabel: req.dayLabel || req.date,
          time: newTime || req.time,
          title: `Date Meeting: ${req.title}`,
          location: req.location || 'Home',
          category: 'Prep',
          status: 'Confirmed',
          forWho: 'BOTH',
          notes: req.notes || `Scheduled meeting between Manzi & Nikita.`,
          completed: false,
          image: '/images/backgroungImage.jpg',
        };
        updatedEvents = [newEvent, ...prev.events];
      }

      return {
        ...prev,
        meetingRequests: updatedRequests,
        events: updatedEvents
      };
    });
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all itinerary details to default?')) {
      const fresh = resetStoredData();
      setData(fresh);
      setCurrentUser('GUEST');
      localStorage.removeItem('MN_ACTIVE_USER');
    }
  };

  return (
    <div className="app-root">
      
      <Navbar
        couple={data.couple}
        editMode={editMode}
        setEditMode={setEditMode}
        onOpenEditModal={() => setIsEditDetailsOpen(true)}
        onResetData={handleResetData}
        currentUser={currentUser}
        onOpenLoginModal={(role) => {
          if (role && (role === 'MANZI' || role === 'NIKITA')) {
            setLoginTargetRole(role);
          }
          setIsLoginModalOpen(true);
        }}
      />

      <Hero
        couple={data.couple}
        tripInfo={data.tripInfo}
        currentUser={currentUser}
      />

      <ItineraryPlanner
        events={data.events}
        dayTitles={data.dayTitles || {}}
        onUpdateDayTitle={handleUpdateDayTitle}
        onToggleComplete={handleToggleComplete}
        onDeleteEvent={handleDeleteEvent}
        onOpenAddModal={handleOpenAddEventModal}
        onEditEvent={handleEditEventClick}
      />

      <SecretVault
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser('GUEST');
          localStorage.removeItem('MN_ACTIVE_USER');
        }}
        events={data.events || []}
        sharedTodos={data.sharedTodos || []}
        manziSecretTodos={data.manziSecretTodos || []}
        nikitaSecretTodos={data.nikitaSecretTodos || []}
        manziSecretNotes={data.manziSecretNotes || []}
        nikitaSecretNotes={data.nikitaSecretNotes || []}
        manziVows={data.manziVows || ''}
        nikitaVows={data.nikitaVows || ''}
        meetingRequests={data.meetingRequests || []}
        onCreateMeetingRequest={handleCreateMeetingRequest}
        onRespondMeetingRequest={handleRespondMeetingRequest}
        onSaveVows={handleSaveVows}
        onAddTodo={handleAddTodo}
        onToggleTodo={handleToggleTodo}
        onSignTodo={handleSignTodo}
        onDeleteTodo={handleDeleteTodo}
        onAddSecretNote={handleAddSecretNote}
        onDeleteSecretNote={handleDeleteSecretNote}
        onOpenLoginModal={(role) => {
          if (role && (role === 'MANZI' || role === 'NIKITA')) {
            setLoginTargetRole(role);
          }
          setIsLoginModalOpen(true);
        }}
      />

      <Footer couple={data.couple} />

      {/* Modal 1: Edit Details Modal */}
      {isEditDetailsOpen && (
        <EditDetailsModal
          tripInfo={data.tripInfo}
          couple={data.couple}
          onSave={handleSaveDetails}
          onClose={() => setIsEditDetailsOpen(false)}
        />
      )}

      {/* Modal 2: Add / Edit Event Modal */}
      <AddEventModal
        isOpen={isAddEventOpen}
        onClose={() => {
          setIsAddEventOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        editingEvent={editingEvent}
        dayTitles={data.dayTitles || {}}
      />

      {/* Modal 3: Profile Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        initialRole={loginTargetRole}
        onLogin={(role) => {
          setCurrentUser(role);
          localStorage.setItem('MN_ACTIVE_USER', role);
        }}
        onUpdatePin={(role, newPin) => {
          setData(prev => ({
            ...prev,
            auth: {
              ...(prev.auth || { manziPin: '1234', nikitaPin: '5678' }),
              [role === 'MANZI' ? 'manziPin' : 'nikitaPin']: newPin
            }
          }));
        }}
        currentUser={currentUser}
        auth={data.auth || { manziPin: '1234', nikitaPin: '5678' }}
      />

    </div>
  );
}
