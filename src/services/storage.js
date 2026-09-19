import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// wedding/shared is readable by anyone but only writable by Manzi/Nikita's
// accounts; wedding/private_manzi and private_nikita are readable/writable
// only by that person's own account (enforced in firestore.rules).
const LEGACY_STORAGE_KEY = 'MN_ANNIVERSARY_DATA_V46';

export const initialSharedData = {
  couple: {
    partner1: 'Manzi',
    partner2: 'Nikita',
    monogram1: 'M',
    monogram2: 'N',
    fullTitle: 'Manzi & Nikita — Civil Wedding',
    yearText: 'Civil Wedding Celebration',
    subtitle: 'Celebrating Manzi & Nikita tying the knot at Toronto City Hall',
    heroImage: '/images/backgroungImage.jpg',
  },
  itineraryActivityLog: [
    {
      id: 'log-1',
      text: 'Civil Ceremony confirmed for Thursday, Oct 15 at 12:30 PM (60 Queen Street West)',
      author: 'System',
      date: 'Oct 15, 2026 @ 12:30 PM'
    }
  ],
  meetingRequests: [],
  sharedTodos: [],
  guestList: [],
  budgetPlanner: {
    totalBudget: 10000,
    expenses: []
  },
  documentVault: [],
  dayTitles: {
    '2026-09-15': 'Marriage License Submission',
    '2026-09-25': 'Vow Finalization & Rings Check',
    '2026-10-08': 'Start Packing Checklist',
    '2026-10-10': 'Traditional Irembo Day',
    '2026-10-13': 'Beauty Prep & Nails Day',
    '2026-10-14': 'Hair Appointment & Toronto Roadtrip Drive',
    '2026-10-15': 'Civil Ceremony, Resto Dinner & Night Club',
    '2026-10-16': 'The Morning After (Brunch) & Family Dinner',
    '2026-10-17': 'Airbnb Checkout & Departure',
  },
  tripInfo: {
    travelType: 'Roadtrip Drive',
    arrivalDate: 'Oct 14, 2026',
    departureDate: 'Oct 17, 2026',
    city: 'Toronto, ON',
    cityImage: '/images/TorontoCity.jpg',
    hotelName: 'Airbnb on King Street West',
    hotelAddress: 'King Street West, Toronto, ON',
    hotelCheckIn: 'Oct 14, 2026 at 3:00 PM',
    hotelImage: '/images/checkin_image.jpg',
    checkoutImage: '/images/backhome.jpg',
    civilVenue: 'Toronto City Hall',
    civilAddress: '60 Queen Street West, Toronto',
    civilTime: 'Oct 15, 2026 at 12:30 PM',
    civilImage: '/images/civil_venue.webp',
    iremboDetails: '10/10/2026 at 4:30 PM at 119 Beausoleil',
    familyDinner: 'Oct 16, 2026 (Friday Evening)',
    familyDinnerImage: '/images/familydinner.jpg',
    restoDinner: 'Oct 15, 2026 (Thursday Resto Celebration)',
    restoImage: '/images/restoImage.jpg',
    clubImage: '/images/club.jpg',
    hairAppointment: 'Wednesday, Oct 14 @ Morning (MMTouch)',
    hairImage: '/images/hair_Inspo.jpg',
    nailAppointment: 'Tuesday, Oct 13 @ Evening (J’adore Nails, Plateau)',
    nailImage: '/images/nail_Inspo.jpeg',
    familyLeaving: 'Roadtrip drive back (Flexible schedule)',
  },
  events: [
    {
      id: 'evt-sep-license',
      date: '2026-09-15',
      dayLabel: 'Tuesday, Sept 15',
      time: '10:00 AM',
      title: 'Marriage License Filing',
      location: 'City Registry Office',
      category: 'Paperwork',
      status: 'Confirmed',
      forWho: 'BOTH',
      notes: 'Official marriage license paperwork submission for City Hall ceremony.',
      completed: false,
      image: '/images/marriageLicense.jpg',
    },
    {
      id: 'evt-sep-vows',
      date: '2026-09-25',
      dayLabel: 'Friday, Sept 25',
      time: '07:00 PM',
      title: 'Vows & Rings Confirmation',
      location: 'Home',
      category: 'Prep',
      status: 'Confirmed',
      forWho: 'BOTH',
      notes: 'Finalizing wedding vows and double-checking wedding ring sizes.',
      completed: false,
      image: '/images/vows_image.jpg',
    },
    {
      id: 'evt-oct-pack',
      date: '2026-10-08',
      dayLabel: 'Thursday, Oct 8',
      time: '06:00 PM',
      title: 'Start Packing',
      location: 'Home',
      category: 'Planning',
      status: 'Confirmed',
      forWho: 'BOTH',
      notes: 'Reviewing wedding outfits, travel documents, and roadtrip luggage packing.',
      completed: false,
      image: '/images/packingChecklist.jpg',
    },
    {
      id: 'evt-1',
      date: '2026-10-10',
      dayLabel: 'Saturday, Oct 10',
      time: '04:30 PM',
      title: 'Hand in Marriage (Irembo)',
      location: '119 Beausoleil',
      category: 'Irembo',
      status: 'Confirmed',
      forWho: 'BOTH',
      notes: 'Family gathering & traditional Irembo ceremony for Manzi & Nikita at 119 Beausoleil.',
      completed: false,
      image: '/images/Irembo_image.jpg',
    },
    {
      id: 'evt-nail',
      date: '2026-10-13',
      dayLabel: 'Tuesday, Oct 13',
      time: '05:30 PM',
      title: 'Fresh Claws & Nails',
      location: 'J’adore Nails, Plateau',
      category: 'Beauty',
      status: 'Confirmed',
      forWho: 'NIKITA',
      notes: 'Evening nail appointment at J’adore Nails, Plateau for Nikita.',
      completed: false,
      image: '/images/nail_Inspo.jpeg',
    },
    {
      id: 'evt-suit',
      date: '2026-10-14',
      dayLabel: 'Wednesday, Oct 14',
      time: '08:30 AM',
      title: 'Barber Appointment',
      location: 'Location TBD',
      category: 'Beauty',
      status: 'Confirmed',
      forWho: 'MANZI',
      notes: 'Tailored suit pickup, press, and haircut for Manzi.',
      completed: false,
      image: '/images/barber_image.jpg',
    },
    {
      id: 'evt-hair',
      date: '2026-10-14',
      dayLabel: 'Wednesday, Oct 14',
      time: '09:30 AM',
      title: 'Hair Appointment',
      location: 'MMTouch Salon',
      category: 'Beauty',
      status: 'Confirmed',
      forWho: 'NIKITA',
      notes: 'Morning hair appointment session with MMTouch for Nikita before the roadtrip.',
      completed: false,
      image: '/images/hair_Inspo.jpg',
    },
    {
      id: 'evt-roadtrip',
      date: '2026-10-14',
      dayLabel: 'Wednesday, Oct 14',
      time: '11:30 AM',
      title: 'On the Road to Toronto',
      location: 'Highway Route to Toronto, ON',
      category: 'Roadtrip',
      status: 'Confirmed',
      forWho: 'BOTH',
      notes: 'Roadtrip drive to Toronto for the civil wedding trip.',
      completed: false,
      image: '/images/TorontoCity.jpg',
      playlist: [
        { id: 'p-1', title: 'Golden Hour', artist: 'Kacey Musgraves' },
        { id: 'p-2', title: 'Beyond', artist: 'Leon Bridges' },
        { id: 'p-3', title: 'Electric Love', artist: 'BØRNS' },
        { id: 'p-4', title: 'Intambwe / Afro Vibe Drive', artist: 'Rwanda Hits' },
        { id: 'p-5', title: 'Lover', artist: 'Taylor Swift' }
      ]
    },
    {
      id: 'evt-2',
      date: '2026-10-14',
      dayLabel: 'Wednesday, Oct 14',
      time: '03:00 PM',
      title: 'Airbnb Check-in & Arrival',
      location: 'King Street West, Toronto',
      category: 'Hotel',
      status: 'Confirmed',
      forWho: 'BOTH',
      notes: 'Check-in to King Street West Airbnb upon completing the roadtrip drive.',
      completed: false,
      image: '/images/checkin_image.jpg',
    },
    {
      id: 'evt-3',
      date: '2026-10-15',
      dayLabel: 'Thursday, Oct 15',
      time: '09:00 AM',
      title: 'Glam Up',
      location: 'King Street West Airbnb',
      category: 'Beauty',
      status: 'Confirmed',
      forWho: 'NIKITA',
      notes: 'Hair, makeup & bridal gown prep for Nikita ahead of the Civil Marriage Ceremony.',
      completed: false,
      image: '/images/civil_prepMorning.jpg',
    },
    {
      id: 'evt-manzi-prep',
      date: '2026-10-15',
      dayLabel: 'Thursday, Oct 15',
      time: '10:00 AM',
      title: 'Groom Suit & Prep',
      location: 'King Street West Airbnb',
      category: 'Civil',
      status: 'Confirmed',
      forWho: 'MANZI',
      notes: 'Suit dressing, tie adjustment, and groom prep for Manzi before the ceremony.',
      completed: false,
      image: '/images/groomprep.jpg',
    },
    {
      id: 'evt-4',
      date: '2026-10-15',
      dayLabel: 'Thursday, Oct 15',
      time: '12:30 PM',
      title: 'Tying the Knot',
      location: '60 Queen Street West, Toronto',
      category: 'Civil',
      status: 'Confirmed',
      forWho: 'BOTH',
      notes: 'Official Civil Wedding Ceremony! Manzi & Nikita tying the knot at 60 Queen Street West. Arrive by 12:00 PM.',
      completed: false,
      image: '/images/civil_venue.webp',
    },
    {
      id: 'evt-6',
      date: '2026-10-15',
      dayLabel: 'Thursday, Oct 15',
      time: '06:30 PM',
      title: 'Romantic Resto Dinner',
      location: 'Resto TBD (Downtown Toronto)',
      category: 'Dinner',
      status: 'Confirmed',
      forWho: 'BOTH',
      notes: 'Romantic resto wedding celebration dinner for Manzi & Nikita following the Civil Ceremony.',
      completed: false,
      image: '/images/restoImage.jpg',
    },
    {
      id: 'evt-7',
      date: '2026-10-15',
      dayLabel: 'Thursday, Oct 15',
      time: '11:00 PM',
      title: 'In the Club We All Fam',
      location: 'Location TBD',
      category: 'Leisure',
      status: 'Planning',
      forWho: 'BOTH',
      notes: 'In the club we all fam. Late night club celebration with friends following the Resto Dinner.',
      completed: false,
      image: '/images/club.jpg',
    },
    {
      id: 'evt-brunch',
      date: '2026-10-16',
      dayLabel: 'Friday, Oct 16',
      time: '01:00 PM',
      title: 'The Morning After (Brunch)',
      location: 'Downtown Toronto',
      category: 'Brunch',
      status: 'Confirmed',
      forWho: 'BOTH',
      notes: 'Post-wedding celebration brunch at 1:00 PM before the family dinner.',
      completed: false,
      image: '/images/brunch_image.jpg',
    },
    {
      id: 'evt-5',
      date: '2026-10-16',
      dayLabel: 'Friday, Oct 16',
      time: '06:00 PM',
      title: 'Two Becomes One',
      location: 'Toronto (Family Gathering)',
      category: 'Family',
      status: 'Confirmed',
      forWho: 'BOTH',
      notes: 'Family dinner celebrating the newly married couple Manzi & Nikita on Friday.',
      completed: false,
      image: '/images/familydinner.jpg',
    },
    {
      id: 'evt-8',
      date: '2026-10-17',
      dayLabel: 'Saturday, Oct 17',
      time: '11:00 AM',
      title: 'Airbnb Checkout & Roadtrip Home',
      location: 'King Street West, Toronto',
      category: 'Departure',
      status: 'Confirmed',
      forWho: 'BOTH',
      notes: 'Airbnb checkout and roadtrip drive back home.',
      completed: false,
      image: '/images/backhome.jpg',
    },
  ],
};

export const initialPrivateData = {
  vows: '',
  personalNotes: '',
};

function buildSharedSeed() {
  try {
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      const dropped = ['manziVows', 'nikitaVows', 'auth', 'manziSecretTodos', 'nikitaSecretTodos', 'manziSecretNotes', 'nikitaSecretNotes', 'guestContributions'];
      const shared = Object.fromEntries(Object.entries(parsed).filter(([key]) => !dropped.includes(key)));
      return { ...initialSharedData, ...shared };
    }
  } catch {}
  return initialSharedData;
}

function buildPrivateSeed(role) {
  try {
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    const legacyVows = legacy ? JSON.parse(legacy)[role === 'MANZI' ? 'manziVows' : 'nikitaVows'] : '';
    const legacyNotes = localStorage.getItem(`mn_personal_notes_${role}_v4`) || '';
    return { ...initialPrivateData, vows: legacyVows || '', personalNotes: legacyNotes };
  } catch {
    return initialPrivateData;
  }
}

// Falls back to seed data if the doc doesn't exist yet — guests can't write,
// so it's only actually created once Manzi or Nikita saves something.
export const subscribeShared = (callback) => {
  const ref = doc(db, 'wedding', 'shared');
  return onSnapshot(ref, (snap) => {
    callback(snap.exists() ? snap.data() : buildSharedSeed());
  }, (err) => console.error('Failed to load shared wedding data', err));
};

export const saveShared = (data) => {
  setDoc(doc(db, 'wedding', 'shared'), data).catch((err) => console.error('Failed to save shared wedding data', err));
};

const privateDocId = (role) => (role === 'MANZI' ? 'private_manzi' : 'private_nikita');

export const subscribePrivate = (role, callback) => {
  const ref = doc(db, 'wedding', privateDocId(role));
  return onSnapshot(ref, (snap) => {
    callback(snap.exists() ? snap.data() : buildPrivateSeed(role));
  }, (err) => console.error('Failed to load private vault data', err));
};

export const savePrivate = (role, data) => {
  setDoc(doc(db, 'wedding', privateDocId(role)), data).catch((err) => console.error('Failed to save private vault data', err));
};

export const resetSharedData = () => {
  setDoc(doc(db, 'wedding', 'shared'), initialSharedData).catch((err) => console.error('Failed to reset shared wedding data', err));
};
