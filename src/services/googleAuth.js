// Real enforcement is in firestore.rules — this just decides what the UI shows.
export const ALLOWED_ACCOUNTS = {
  'rmanzi64@gmail.com': 'MANZI',
  'nikitaineza1@gmail.com': 'NIKITA',
  // TEMP: Diandra's own account, for previewing/editing before the couple
  // signs in for the first time. Remove once they've started using it.
  'inturirediandra@gmail.com': 'MANZI',
};

export const getRoleForEmail = (email) => ALLOWED_ACCOUNTS[(email || '').toLowerCase()] || null;
