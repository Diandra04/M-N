import React, { useState, useEffect } from 'react';
import { X, Upload, RotateCcw } from 'lucide-react';

const DEFAULT_EVENT_IMAGE = '/images/backgroungImage.jpg';

export function AddEventModal({ isOpen, onClose, onSave, editingEvent, dayTitles = {} }) {
  const [date, setDate] = useState('2026-10-15');
  const [dayLabel, setDayLabel] = useState('Thursday, Oct 15');
  const [dateTitle, setDateTitle] = useState('');
  const [time, setTime] = useState('07:30 PM');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Dinner');
  const [status, setStatus] = useState('Confirmed');
  const [forWho, setForWho] = useState('BOTH');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(DEFAULT_EVENT_IMAGE);

  useEffect(() => {
    if (editingEvent) {
      const initialDate = editingEvent.date || '2026-10-15';
      setDate(initialDate);
      setDayLabel(editingEvent.dayLabel || 'Thursday, Oct 15');
      setDateTitle(editingEvent.dateTitle || dayTitles[initialDate] || '');
      setTime(editingEvent.time || '07:30 PM');
      setTitle(editingEvent.title || '');
      setLocation(editingEvent.location || '');
      setCategory(editingEvent.category || 'Dinner');
      setStatus(editingEvent.status || 'Confirmed');
      setForWho(editingEvent.forWho || 'BOTH');
      setNotes(editingEvent.notes || '');
      setImage(editingEvent.image || DEFAULT_EVENT_IMAGE);
    } else {
      const initialDate = '2026-10-15';
      setDate(initialDate);
      setDayLabel('Thursday, Oct 15');
      setDateTitle(dayTitles[initialDate] || '');
      setTime('07:30 PM');
      setTitle('');
      setLocation('');
      setCategory('Dinner');
      setStatus('Confirmed');
      setForWho('BOTH');
      setNotes('');
      setImage(DEFAULT_EVENT_IMAGE);
    }
  }, [editingEvent, isOpen]);

  const handleDateChange = (val) => {
    setDate(val);
    setDateTitle(dayTitles[val] || '');
    switch (val) {
      case '2026-10-10': setDayLabel('Saturday, Oct 10'); break;
      case '2026-10-13': setDayLabel('Tuesday, Oct 13'); break;
      case '2026-10-14': setDayLabel('Wednesday, Oct 14'); break;
      case '2026-10-15': setDayLabel('Thursday, Oct 15'); break;
      case '2026-10-16': setDayLabel('Friday, Oct 16'); break;
      case '2026-10-17': setDayLabel('Saturday, Oct 17'); break;
      default: setDayLabel(val); break;
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    onSave({
      id: editingEvent ? editingEvent.id : 'evt-' + Date.now(),
      date,
      dayLabel,
      dateTitle,
      time,
      title,
      location: location || 'Toronto, ON',
      category,
      status,
      forWho,
      notes,
      image: image || DEFAULT_EVENT_IMAGE,
      completed: editingEvent ? editingEvent.completed : false,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-vintage)', fontStyle: 'italic', color: '#000' }}>
            {editingEvent ? 'Edit Schedule Event' : 'Add New Itinerary Event'}
          </h3>
          <button onClick={onClose} className="modal-close-btn" style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Event Date</label>
              <select 
                value={date} 
                onChange={(e) => handleDateChange(e.target.value)} 
                className="form-select"
              >
                <option value="2026-10-10">Oct 10 (Irembo Day)</option>
                <option value="2026-10-13">Oct 13 (Nails Day)</option>
                <option value="2026-10-14">Oct 14 (Arrival & Drive)</option>
                <option value="2026-10-15">Oct 15 (Civil Ceremony Day)</option>
                <option value="2026-10-16">Oct 16 (Brunch & Family Dinner)</option>
                <option value="2026-10-17">Oct 17 (Departure Day)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Time</label>
              <input 
                type="text" 
                placeholder="e.g. 12:30 PM"
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
                className="form-input" 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Date Header Subtitle</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'none' }}>
                e.g. "Hair Styling & Toronto Roadtrip Drive"
              </span>
            </label>
            <input 
              type="text" 
              placeholder="e.g. Hair Styling & Toronto Roadtrip Drive"
              value={dateTitle} 
              onChange={(e) => setDateTitle(e.target.value)} 
              className="form-input" 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Event Title</label>
            <input 
              type="text" 
              placeholder="e.g. Civil Marriage Ceremony / Champagne Toast"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="form-input" 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location / Address</label>
            <input 
              type="text" 
              placeholder="e.g. 60 Queen Street West, Toronto"
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              className="form-input" 
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Event Photo Image</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'none' }}>
                Upload from Phone, iPad, or Laptop
              </span>
            </label>

            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#111',
                border: '1px solid var(--border-color)',
                flexShrink: 0
              }}>
                <img src={image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: 'var(--text-primary)',
                  color: 'var(--bg-main)',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: 'fit-content'
                }}>
                  <Upload size={14} />
                  <span>Choose Photo from Device</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    style={{ display: 'none' }} 
                  />
                </label>

                {image !== DEFAULT_EVENT_IMAGE && (
                  <button
                    type="button"
                    onClick={() => setImage(DEFAULT_EVENT_IMAGE)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      width: 'fit-content'
                    }}
                  >
                    <RotateCcw size={12} /> Reset to Default Image
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="form-select"
              >
                <option value="Civil">Civil Ceremony</option>
                <option value="Irembo">Irembo</option>
                <option value="Beauty">Beauty & Prep</option>
                <option value="Hotel">Hotel & Stay</option>
                <option value="Dinner">Dinner / Restaurant</option>
                <option value="Brunch">Brunch</option>
                <option value="Family">Family Gathering</option>
                <option value="Leisure">Leisure & Club</option>
                <option value="Departure">Departure</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)} 
                className="form-select"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Planning">Planning</option>
                <option value="Changes in progress">Changes in progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Event Dedicated To (Color Tag)</label>
            <select 
              value={forWho} 
              onChange={(e) => setForWho(e.target.value)} 
              className="form-select"
              style={{ fontWeight: 600 }}
            >
              <option value="BOTH">Both</option>
              <option value="NIKITA">Nikita</option>
              <option value="MANZI">Manzi</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Notes & Details</label>
            <textarea 
              rows={2} 
              placeholder="e.g. Arrive 30 minutes early, bring documents..."
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              className="form-textarea"
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={onClose} className="btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingEvent ? 'Save Changes' : 'Add Event to Itinerary'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
