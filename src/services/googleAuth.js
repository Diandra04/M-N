// Real enforcement is in firestore.rules — this just decides what the UI shows.
export const ALLOWED_ACCOUNTS = {
  'rmanzi64@gmail.com': 'MANZI',
  'nikitaineza1@gmail.com': 'NIKITA',
};

export const getRoleForEmail = (email) => ALLOWED_ACCOUNTS[(email || '').toLowerCase()] || null;
