import React from 'react';
import { Home, Landmark, Users, Utensils, Edit } from 'lucide-react';

export function QuickOverviewCards({ tripInfo, editMode, onOpenEditModal }) {
  const cards = [
    {
      icon: <Home size={20} color="var(--text-accent)" />,
      title: 'Hotel & Stay',
      primary: tripInfo.hotelName,
      secondary: `Check-in: ${tripInfo.hotelCheckIn}`,
      badge: 'Arrival Oct 14',
      badgeColor: 'badge-gold',
      image: '/images/backgroungImage.jpg',
    },
    {
      icon: <Landmark size={20} color="var(--text-accent)" />,
      title: 'Civil Marriage Place',
      primary: tripInfo.civilAddress,
      secondary: `Ceremony Time: ${tripInfo.civilTime}`,
      badge: 'Oct 15 @ 12:30 PM',
      badgeColor: 'badge-gold',
      image: '/images/civil_venue.webp',
    },
    {
      icon: <Users size={20} color="var(--text-accent)" />,
      title: 'Irembo Celebration',
      primary: tripInfo.iremboDetails,
      secondary: 'Family gathering & tradition at 119 Beausoleil',
      badge: '10/10 @ 4:30 PM',
      badgeColor: '',
      image: '/images/Irembo_image.jpg',
    },
    {
      icon: <Utensils size={20} color="var(--text-accent)" />,
      title: 'Anniversary Dinners',
      primary: `Family: ${tripInfo.familyDinner}`,
      secondary: `Resto: ${tripInfo.restoDinner}`,
      badge: 'In Progress / Changes',
      badgeColor: '',
      image: '/images/familydinner.jpg',
    },
  ];

  return (
    <section style={{ marginBottom: '3rem' }}>
      <div className="container">
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.8rem' }}>Trip & Event Snapshot</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Quick reference for key addresses, times, and ceremony locations
            </p>
          </div>
          
          {editMode && (
            <button 
              onClick={onOpenEditModal}
              className="btn-outline btn-sm"
              style={{ gap: '0.4rem' }}
            >
              <Edit size={14} />
              <span>Update Details</span>
            </button>
          )}
        </div>

        <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {cards.map((c, i) => (
            <div key={i} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {c.icon}
                  </div>
                  <span className={`badge ${c.badgeColor}`}>{c.badge}</span>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>
                  {c.title}
                </div>

                <div style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  {c.primary}
                </div>
              </div>

              {c.image && (
                <div style={{ 
                  margin: '0.6rem 0', 
                  height: '110px', 
                  borderRadius: '8px', 
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)' 
                }}>
                  <img src={c.image} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <div style={{ 
                fontSize: '0.85rem', 
                color: 'var(--text-secondary)',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '0.6rem',
                marginTop: '0.5rem'
              }}>
                {c.secondary}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
