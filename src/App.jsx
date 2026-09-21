import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, signInWithPopup } from 'firebase/auth';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ItineraryPlanner } from './components/ItineraryPlanner';
import { SecretVault } from './components/SecretVault';
import { Footer } from './components/Footer';
import { EditDetailsModal } from './components/EditDetailsModal';
import { AddEventModal } from './components/AddEventModal';
import { LoginModal } from './components/LoginModal';
import { SignInGate } from './components/SignInGate';
import { auth, googleProvider } from './services/firebase';
import { getRoleForEmail } from './services/googleAuth';
import {
  initialSharedData,
  initialPrivateData,
  subscribeShared,
  saveShared,
  resetSharedData,
  subscribePrivate,
  savePrivate,
} from './services/storage';

export default function App() {
  const [data, setData] = useState(initialSharedData);
  const [privateData, setPrivateData] = useState(initialPrivateData);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState('GUEST'); // 'GUEST' | 'MANZI' | 'NIKITA'
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState('');

  const [isEditDetailsOpen, setIsEditDetailsOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeShared(setData);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const role = getRoleForEmail(user?.email);
      if (user && !role) {
        setAuthError(`"${user.email}" isn't linked to this planner.`);
        signOut(auth);
        setCurrentUser('GUEST');
        setAuthReady(true);
        return;
      }
      setCurrentUser(role || 'GUEST');
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  const handleGoogleSignIn = async () => {
    setAuthError('');
    try {
      await signInWithPopup(auth, googleProvider);
      // Role check + "not linked" rejection happens in onAuthStateChanged above.
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setAuthError('Sign-in failed. Please try again.');
      }
    }
  };

  useEffect(() => {
    // vows/notes are per-person Firestore docs, only readable by that account
    if (currentUser !== 'MANZI' && currentUser !== 'NIKITA') {
      setPrivateData(initialPrivateData);
      return;
    }
    const unsubscribe = subscribePrivate(currentUser, setPrivateData);
    return unsubscribe;
  }, [currentUser]);

  const updateShared = (updater) => {
    setData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveShared(next);
      return next;
    });
  };

  const updatePrivate = (updater) => {
    if (currentUser !== 'MANZI' && currentUser !== 'NIKITA') return;
    setPrivateData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      savePrivate(currentUser, next);
      return next;
    });
  };

  const handleToggleComplete = (eventId) => {
    updateShared(prev => ({
      ...prev,
      events: prev.events.map(e => e.id === eventId ? { ...e, completed: !e.completed } : e)
    }));
  };

  const handleDeleteEvent = (eventId) => {
    updateShared(prev => ({
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

    updateShared(prev => {
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
    updateShared(prev => ({
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
    updateShared(prev => ({
      ...prev,
      couple: { ...prev.couple, ...updated.couple },
      tripInfo: { ...prev.tripInfo, ...updated.tripInfo },
    }));
  };

  const handleAddTodo = (newTodo) => {
    updateShared(prev => ({
      ...prev,
      sharedTodos: [newTodo, ...(prev.sharedTodos || [])]
    }));
  };

  const handleToggleTodo = (todoId) => {
    updateShared(prev => ({
      ...prev,
      sharedTodos: (prev.sharedTodos || []).map(t => t.id === todoId ? { ...t, completed: !t.completed } : t)
    }));
  };

  const handleSignTodo = (todoId, role) => {
    const isM = role === 'MANZI';
    const isN = role === 'NIKITA';
    updateShared(prev => ({
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

  const handleDeleteTodo = (todoId) => {
    updateShared(prev => ({
      ...prev,
      sharedTodos: (prev.sharedTodos || []).filter(t => t.id !== todoId)
    }));
  };

  const handleSaveVows = (vowsText) => {
    updatePrivate(prev => ({ ...prev, vows: vowsText }));
  };

  const handleSavePersonalNotes = (notesText) => {
    updatePrivate(prev => ({ ...prev, personalNotes: notesText }));
  };

  const handleSaveGuestList = (guestList) => {
    updateShared(prev => ({ ...prev, guestList }));
  };

  const handleSaveBudget = (budgetPlanner) => {
    updateShared(prev => ({ ...prev, budgetPlanner }));
  };

  const handleSaveDocuments = (documentVault) => {
    updateShared(prev => ({ ...prev, documentVault }));
  };

  const handleCreateMeetingRequest = (requestData) => {
    updateShared(prev => ({
      ...prev,
      meetingRequests: [requestData, ...(prev.meetingRequests || [])]
    }));
  };

  const handleRespondMeetingRequest = (requestId, status, newTime = null) => {
    updateShared(prev => {
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
      resetSharedData();
      setData(initialSharedData);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (!authReady || currentUser === 'GUEST') {
    return <SignInGate errorMsg={authError} onSignIn={handleGoogleSignIn} />;
  }

  return (
    <div className="app-root">

      <Navbar
        couple={data.couple}
        editMode={editMode}
        setEditMode={setEditMode}
        onOpenEditModal={() => setIsEditDetailsOpen(true)}
        onResetData={handleResetData}
        currentUser={currentUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      <Hero
        couple={data.couple}
        tripInfo={data.tripInfo}
        currentUser={currentUser}
      />

      <ItineraryPlanner
        events={data.events}
        dayTitles={data.dayTitles || {}}
        currentUser={currentUser}
        onUpdateDayTitle={handleUpdateDayTitle}
        onToggleComplete={handleToggleComplete}
        onDeleteEvent={handleDeleteEvent}
        onOpenAddModal={handleOpenAddEventModal}
        onEditEvent={handleEditEventClick}
      />

      <SecretVault
        currentUser={currentUser}
        events={data.events || []}
        sharedTodos={data.sharedTodos || []}
        vows={privateData.vows || ''}
        personalNotes={privateData.personalNotes || ''}
        guestList={data.guestList || []}
        budgetPlanner={data.budgetPlanner || { totalBudget: 10000, expenses: [] }}
        documentVault={data.documentVault || []}
        meetingRequests={data.meetingRequests || []}
        onCreateMeetingRequest={handleCreateMeetingRequest}
        onRespondMeetingRequest={handleRespondMeetingRequest}
        onSaveVows={handleSaveVows}
        onSavePersonalNotes={handleSavePersonalNotes}
        onSaveGuestList={handleSaveGuestList}
        onSaveBudget={handleSaveBudget}
        onSaveDocuments={handleSaveDocuments}
        onAddTodo={handleAddTodo}
        onToggleTodo={handleToggleTodo}
        onSignTodo={handleSignTodo}
        onDeleteTodo={handleDeleteTodo}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      <Footer couple={data.couple} />

      {isEditDetailsOpen && (
        <EditDetailsModal
          tripInfo={data.tripInfo}
          couple={data.couple}
          onSave={handleSaveDetails}
          onClose={() => setIsEditDetailsOpen(false)}
        />
      )}

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

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        errorMsg={authError}
        onSignIn={handleGoogleSignIn}
      />

    </div>
  );
}
