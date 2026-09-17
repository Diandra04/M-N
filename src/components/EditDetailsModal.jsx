import React, { useState } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';

export function EditDetailsModal({ tripInfo, couple, onSave, onClose }) {
  const [formData, setFormData] = useState({
    partner1: couple.partner1 || 'M',
    partner2: couple.partner2 || 'N',
    fullTitle: couple.fullTitle || 'M & N — 3rd Anniversary & Civil Celebration',
    yearText: couple.yearText || '3rd Anniversary',
    subtitle: couple.subtitle || '',
    
    hotelName: tripInfo.hotelName || 'Airbnb on King Street West',
    hotelCheckIn: tripInfo.hotelCheckIn || 'Oct 14, 2026 at 3:00 PM',
    civilVenue: tripInfo.civilVenue || 'Toronto City Hall',
    civilAddress: tripInfo.civilAddress || '60 Queen Street West, Toronto',
    civilTime: tripInfo.civilTime || 'Oct 15, 2026 at 12:30 PM',
    iremboDetails: tripInfo.iremboDetails || '10/10/2026 at 4:30 PM at Mum’s',
    arrivalDate: tripInfo.arrivalDate || 'Oct 14, 2026',
    departureDate: tripInfo.departureDate || 'Oct 17, 2026',
    familyDinner: tripInfo.familyDinner || 'Oct 15, 2026 (After Ceremony)',
    restoDinner: tripInfo.restoDinner || 'Still working on it (Changes in progress)',
    familyLeaving: tripInfo.familyLeaving || 'TBD / Flexible',
  });

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      couple: {
        partner1: formData.partner1,
        partner2: formData.partner2,
        fullTitle: formData.fullTitle,
        yearText: formData.yearText,
        subtitle: formData.subtitle,
      },
      tripInfo: {
        hotelName: formData.hotelName,
        hotelCheckIn: formData.hotelCheckIn,
        civilVenue: formData.civilVenue,
        civilAddress: formData.civilAddress,
        civilTime: formData.civilTime,
        iremboDetails: formData.iremboDetails,
        arrivalDate: formData.arrivalDate,
        departureDate: formData.departureDate,
        familyDinner: formData.familyDinner,
        restoDinner: formData.restoDinner,
        familyLeaving: formData.familyLeaving,
        city: 'Toronto, ON',
      }
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)' }}>Edit Anniversary & Trip Logistics</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Update hotel, ceremony address, dates, and restaurant details</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-2">
            <div className="form-group">
              <label className="form-label">Partner 1 Name / Initial</label>
              <input 
                type="text" 
                value={formData.partner1} 
                onChange={(e) => handleChange('partner1', e.target.value)} 
                className="form-input" 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Partner 2 Name / Initial</label>
              <input 
                type="text" 
                value={formData.partner2} 
                onChange={(e) => handleChange('partner2', e.target.value)} 
                className="form-input" 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Main Title</label>
            <input 
              type="text" 
              value={formData.fullTitle} 
              onChange={(e) => handleChange('fullTitle', e.target.value)} 
              className="form-input" 
              required 
            />
          </div>

          {/* Section: Hotel & Stay */}
          <div style={{ margin: '1.5rem 0 1rem 0', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--text-accent)' }}>Hotel & Accommodations</h4>
            
            <div className="form-group">
              <label className="form-label">Hotel / Stay Name</label>
              <input 
                type="text" 
                value={formData.hotelName} 
                onChange={(e) => handleChange('hotelName', e.target.value)} 
                className="form-input" 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Check-in Time & Date</label>
              <input 
                type="text" 
                value={formData.hotelCheckIn} 
                onChange={(e) => handleChange('hotelCheckIn', e.target.value)} 
                className="form-input" 
              />
            </div>
          </div>

          {/* Section: Ceremony & Irembo */}
          <div style={{ margin: '1.5rem 0 1rem 0', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--text-accent)' }}>Ceremony & Irembo</h4>

            <div className="form-group">
              <label className="form-label">Civil Marriage Address & Place</label>
              <input 
                type="text" 
                value={formData.civilAddress} 
                onChange={(e) => handleChange('civilAddress', e.target.value)} 
                className="form-input" 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Civil Ceremony Date & Time</label>
              <input 
                type="text" 
                value={formData.civilTime} 
                onChange={(e) => handleChange('civilTime', e.target.value)} 
                className="form-input" 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Irembo Date & Time</label>
              <input 
                type="text" 
                value={formData.iremboDetails} 
                onChange={(e) => handleChange('iremboDetails', e.target.value)} 
                className="form-input" 
              />
            </div>
          </div>

          {/* Section: Dinners & Travel Dates */}
          <div style={{ margin: '1.5rem 0 1rem 0', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--text-accent)' }}>Dinners & Travel Dates</h4>

            <div className="form-group">
              <label className="form-label">Family Dinner Day & Time</label>
              <input 
                type="text" 
                value={formData.familyDinner} 
                onChange={(e) => handleChange('familyDinner', e.target.value)} 
                className="form-input" 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Special Anniversary Resto Dinner</label>
              <input 
                type="text" 
                value={formData.restoDinner} 
                onChange={(e) => handleChange('restoDinner', e.target.value)} 
                className="form-input" 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Family Leaving Day</label>
              <input 
                type="text" 
                value={formData.familyLeaving} 
                onChange={(e) => handleChange('familyLeaving', e.target.value)} 
                className="form-input" 
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Save size={15} /> Save All Details
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
