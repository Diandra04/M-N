# M&N Civil Planner

A private wedding planning web app built for a couple's civil ceremony. It brings the itinerary, shared to-do lists, personal checklists, and budget into one place, with a role-based login so each partner sees their own view.

Built as a gift to help a close friend stay organized while planning her wedding.

## Features

- **Role-based login**: each partner signs in with their own PIN; content and edit access adjust to who is logged in.
- **Civil itinerary planner**: Events grouped chronologically by day along a connected timeline, with filtering by person or by both combined.
- **Event status tracking**: Cards flip to reveal details, notes, and a completion toggle. Completed events are marked visually, and events whose date has passed without being completed are flagged as overdue.
- **Shared vault**: Shared to-do lists, a personal checklist pad with progress tracking, and a passcode-protected notes area.
- **Countdown hero**: Live countdown to the ceremony date.
- **Responsive layout**: Tuned for phone, tablet, and desktop viewports.

## Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```

## Tech stack

React, Vite, and lucide-react, with no backend — data is stored in the browser.
