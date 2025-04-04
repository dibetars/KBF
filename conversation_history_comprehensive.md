# Kwame Bofrot Foundation Web Application Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Setup and Installation](#setup-and-installation)
5. [Development Phases](#development-phases)
6. [Data Flow Architecture](#data-flow-architecture)
7. [Recent Updates](#recent-updates)
8. [Current Status and Future Considerations](#current-status-and-future-considerations)

## Project Overview
The Kwame Bofrot Foundation web application is built on Material Kit 2 React, providing a platform for managing and showcasing sponsored soccer players. The application features user role-based access, player management, and an interactive player showcase.

## Technology Stack
### Frontend
- React.js
- Material-UI (MUI) Components
- Material Kit 2 React Template
- React Router for navigation
- Custom MUI components (MKBox, MKButton, MKTypography, etc.)

### Backend
- Xano Backend Service
- RESTful API Integration
- JSON Data Structure

### Styling
- Material Design System
- Responsive Design
- Custom CSS-in-JS using MUI's styled API
- Flexbox and Grid layouts

## Project Structure
```
material-kit-2-react
├── public/
│   ├── images/
│   ├── videos/
│   └── index.html
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── theme/
│   ├── components/
│   │   ├── MKAlert/
│   │   ├── MKAvatar/
│   │   └── [other components]/
│   ├── layouts/
│   │   └── pages/
│   │       ├── Dashboard/
│   │       ├── HomePage/
│   │       └── [other pages]/
│   └── App.js
└── package.json
```

### Key Directories and Files
- `src/layouts/pages/Dashboard/`: Contains the main dashboard implementation
- `src/layouts/pages/HomePage/`: Homepage with featured players display
- `src/components/`: Reusable UI components
- `src/assets/theme/`: Theme configuration and styling

## Setup and Installation

### Prerequisites
1. Node.js LTS version
2. npm or yarn package manager
3. Git (for version control)

### Installation Steps
1. Clone the repository:
```bash
git clone [repository-url]
cd KBF
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Environment Setup:
- Create `.env` file in root directory
- Add necessary environment variables:
```
REACT_APP_API_URL=https://x8ki-letl-twmt.n7.xano.io/api:TF3YOouP
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

## Development Phases

### Phase 1: Initial Implementation
- Base setup using Material Kit 2 React
- Integration with Xano backend
- Implementation of basic user authentication

### Phase 2: Dashboard Development
- Implementation of player management system
- Role-based access control (Admin/Sponsor views)
- Player filtering and categorization

### Phase 3: Featured Players Section
#### Recent Updates
1. Modified featured players display:
   - Limited to exactly 11 players
   - Shows only sponsored players
   - Implemented 4-4-2 formation display
   - Enhanced position filtering

```javascript
const formation = {
  // 1 Goalkeeper
  GK: featuredPlayers.filter(p => 
    p.position?.toLowerCase() === "gk" || 
    p.position?.toLowerCase() === "goalkeeper"
  ).slice(0, 1),

  // 4 Defenders
  DEF: featuredPlayers.filter(p => {
    const pos = p.position?.toLowerCase() || '';
    return ['cb', 'rb', 'lb', 'defender', 'fb'].includes(pos);
  }).slice(0, 4),

  // 4 Midfielders
  MID: featuredPlayers.filter(p => {
    const pos = p.position?.toLowerCase() || '';
    return ['cdm', 'cm', 'cam', 'midfielder', 'dm', 'winger', 'rw', 'lw'].includes(pos);
  }).slice(0, 4),

  // 2 Forwards
  FWD: featuredPlayers.filter(p => {
    const pos = p.position?.toLowerCase() || '';
    return ['st', 'cf', 'striker', 'forward', 'attacker'].includes(pos);
  }).slice(0, 2),
};
```

## Data Flow Architecture

### Player Data Flow
1. Data Fetching:
   - API calls to Xano backend
   - Player data filtering and processing
   - State management using React hooks

2. Data Display:
   - Position-based grouping
   - Role-based content filtering
   - Interactive player cards

3. User Interactions:
   - Player detail modal
   - Sponsor assignments
   - Admin management features

## Current Status and Future Considerations

### Current Status
- Implemented featured players section with 4-4-2 formation
- Enhanced player filtering and categorization
- Improved sponsor role view
- Added responsive design elements

### Future Considerations
1. Performance Optimization:
   - Implement pagination for large datasets
   - Add caching for frequently accessed data
   - Optimize image loading

2. Feature Enhancements:
   - Add more formation options
   - Implement player statistics
   - Enhanced search and filter capabilities

3. UI/UX Improvements:
   - Add animations for player transitions
   - Enhance mobile responsiveness
   - Implement dark mode 