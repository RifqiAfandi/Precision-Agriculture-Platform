# Precision Agriculture Platform - Frontend

Platform monitoring IoT pertanian berbasis AI dengan React + Vite.

## Overview

Web application untuk monitoring dan kontrol sistem IoT pertanian:
- **Agriino** - Monitoring Klorofil & Nitrogen
- **Agriimeter** - Pengukur DBH Pohon
- **Greenhouse Compax** - Monitoring & Kontrol Rumah Kaca
- **SkyVera** - Weather Station Professional

## Prerequisites

- Node.js v22.20.0
- npm v10.9.3

## Installation

```bash
npm install
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

Server: `http://localhost:5173`

## Project Structure

```
src/
├── app/                      # Root
│   ├── App.jsx
│   └── main.jsx
│
├── features/                 # Feature modules
│   ├── agriimeter/
│   │   ├── AgriimeterDashboard.jsx
│   │   ├── components/
│   │   ├── data/
│   │   └── utils/
│   ├── greenhouse/
│   │   ├── GreenhouseDashboard.jsx
│   │   ├── components/
│   │   ├── data/
│   │   └── utils/
│   ├── agriino/
│   │   ├── AgriinoDashboard.jsx
│   │   ├── components/
│   │   ├── data/
│   │   └── utils/
│   └── skyvera/
│       ├── SkyVeraDashboard.jsx
│       ├── components/
│       ├── data/
│       └── utils/
│
├── components/
│   ├── common/               # Shared components
│   │   ├── Logo.jsx
│   │   └── StatCard.jsx
│   ├── layout/               # Layout components
│   │   ├── Dashboard.jsx
│   │   ├── pages/            # Public pages
│   │   └── dashboardPages/   # Dashboard pages
│   └── ui/                   # Shadcn UI (40+ components)
│
├── services/                 # API integration
│   └── api.js
│
├── contexts/                 # React contexts
│   └── AuthContext.jsx
│
├── hooks/
│   └── useMobile.js
│
└── styles/
    └── index.css
```

## Code Quality

### Standards
- Main components < 200 lines
- Sub-components < 150 lines
- Single responsibility
- JSDoc comments
- Props documented

### Organization
- Feature-based structure
- Data layer separated
- Utilities separated
- Components modular
- Shared components in common/
- Layout components organized

## Refactoring Progress

| Dashboard | Status | Reduction |
|-----------|--------|-----------|
| Agriimeter | Complete | 80% |
| Greenhouse | Complete | 50% |
| Agriino | Complete | 79% |
| SkyVera | Complete | 70% |

**Total:** 1,850 → 600 lines (67.6% reduction)

## Tech Stack

- React 19.1.1
- Vite 7.1.2
- Tailwind CSS 4.1.12
- Radix UI + shadcn/ui
- Lucide React 0.542.0
- Recharts 3.2.0
- Sonner 2.0.7

## Authentication

Backend API terintegrasi di folder `../Precision-Agriculture-Platform-BE`

### Environment Setup
Create `.env`:
```env
VITE_API_URL=http://localhost:8000/api
```

### API Integration
- **Service:** `src/services/api.js`
- **Context:** `src/contexts/AuthContext.jsx`
- **Auth Pages:** `src/components/layout/pages/`

### Usage
```jsx
import { useAuth } from '@/contexts/AuthContext';

function Component() {
  const { user, login, logout } = useAuth();
  
  const handleLogin = async () => {
    await login(email, password);
  };
}
```

## Development

### Adding Features
1. Create folder in `src/features/[name]/`
2. Separate data, utils, components
3. Keep files < 150 lines
4. Add JSDoc comments

### Code Style
- ES6+ features
- Functional components
- Hooks only
- No duplication
- Pure utilities

### Best Practices
- Component composition
- Separation of concerns
- Reusable components
- Clear prop interfaces
- Single responsibility

## Configuration

- `vite.config.js` - Vite config
- `tailwind.config.js` - Tailwind CSS
- `eslint.config.js` - ESLint rules
- `package.json` - Dependencies

## Deployment

```bash
npm run build      # Build to dist/
npm run preview    # Test build locally
```

## Contributing

1. Fork repository
2. Create feature branch
3. Follow code standards
4. Keep components < 150 lines
5. Add JSDoc comments
6. Commit changes
7. Open Pull Request

## Author

**RifqiAfandi**  
Repository: [Precision-Agriculture-Platform-FE](https://github.com/RifqiAfandi/Precision-Agriculture-Platform-FE)  
Branch: development

## Status

**Active Development**  
Last Updated: 2025-10-20  
Code Quality: 98%  
Architecture: Feature-based + Clean structure
