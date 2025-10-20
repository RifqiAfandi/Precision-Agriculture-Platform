# 🌱 Precision Agriculture Platform - Frontend

Platform monitoring IoT pertanian berbasis AI dengan React + Vite.

## 📋 Overview

Web application untuk monitoring dan kontrol sistem IoT pertanian yang terintegrasi dengan berbagai perangkat:
- **Agriino** - Monitoring Klorofil & Nitrogen
- **Agriimeter** - Pengukur DBH Pohon
- **Greenhouse Compax** - Monitoring & Kontrol Rumah Kaca
- **SkyVera** - Weather Station Professional

## 🚀 Quick Start

### Prerequisites
- Node.js v22.20.0
- npm v10.9.3

### Installation
```bash
# Clone repository
git clone https://github.com/RifqiAfandi/Precision-Agriculture-Platform-FE.git
cd Precision-Agriculture-Platform-FE

# Install dependencies
npm install

# Run development server
npm run dev
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## 📁 Project Structure

```
src/
├── app/                          # Application core
│   ├── App.jsx                   # Root component
│   └── main.jsx                  # Entry point
│
├── features/                     # Feature-based modules
│   ├── agriimeter/               # ✅ Refactored (see REFACTORING_AGRIIMETER.md)
│   │   ├── AgriimeterDashboard.jsx
│   │   ├── components/           # Sub-components
│   │   │   ├── TreeCard.jsx
│   │   │   ├── TreeDetailPanel.jsx
│   │   │   ├── AddTreeForm.jsx
│   │   │   └── DBHHistoryTable.jsx
│   │   ├── data/                 # Data layer
│   │   │   └── agriimeterData.js
│   │   └── utils/                # Utility functions
│   │       └── agriimeterHelpers.js
│   │
│   ├── greenhouse/               # ✅ Refactored (see REFACTORING_GREENHOUSE.md)
│   │   ├── GreenhouseDashboard.jsx
│   │   ├── components/           # Sub-components
│   │   │   ├── MonitoringCard.jsx
│   │   │   ├── ParameterCard.jsx
│   │   │   ├── ControlPanel.jsx
│   │   │   ├── TrendChart.jsx
│   │   │   └── ActionHistoryPanel.jsx
│   │   ├── data/                 # Data layer
│   │   │   └── greenhouseData.js
│   │   └── utils/                # Utility functions
│   │       └── greenhouseHelpers.js
│   │
│   └── agriino/                  # ✅ Refactored (see REFACTORING_AGRIINO.md)
│       ├── AgriinoDashboard.jsx
│       ├── components/           # Sub-components
│       │   ├── PlantCard.jsx
│       │   ├── PlantDetailPanel.jsx
│       │   ├── AddPlantForm.jsx
│       │   └── HistoryTable.jsx
│       ├── data/                 # Data layer
│       │   └── agriinoData.js
│       └── utils/                # Utility functions
│           └── agriinoHelpers.js
│
├── components/
│   ├── common/                   # Shared components
│   │   └── StatCard.jsx          # Reusable stat card
│   │
│   ├── dashboard/                # Dashboard pages
│   │   ├── WelcomePage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── AddDeviceDialog.jsx
│   │   └── SkyVeraDashboard.jsx  # ⏳ Next refactor target
│   │
│   └── ui/                       # Shadcn UI components
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── Input.jsx
│       └── ... (30+ components)
│
├── pages/                        # Page components
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   └── RegisterPage.jsx
│
├── hooks/                        # Custom React hooks
│   └── useMobile.js
│
└── styles/                       # Global styles
    └── index.css
```

## 🎯 Code Quality Standards

### Component Guidelines
- ✅ Main components < 200 lines
- ✅ Sub-components < 150 lines
- ✅ Single responsibility principle
- ✅ JSDoc comments for all exports
- ✅ Props documented in comments

### Folder Organization
- ✅ Feature-based structure (`features/[name]/`)
- ✅ Data separated (`data/[name]Data.js`)
- ✅ Utilities separated (`utils/[name]Helpers.js`)
- ✅ Components modular (`components/[Name].jsx`)
- ✅ Shared components in `components/common/`

## 📊 Refactoring Progress

| Dashboard | Status | Lines Before | Lines After | Reduction |
|-----------|--------|--------------|-------------|-----------|
| Agriimeter | ✅ Complete | 750 | 150 | 80% |
| Greenhouse | ✅ Complete | 280 | 140 | 50% |
| Agriino | ✅ Complete | 620 | 130 | 79% |
| SkyVera | ⏳ Planned | 600 | ~150 | 75% |

**Progress: 3/4 dashboards (75%) completed! 🎉**

**See detailed refactoring docs:**
- [REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md) - Executive summary
- [REFACTORING_AGRIIMETER.md](REFACTORING_AGRIIMETER.md) - Agriimeter full report
- [REFACTORING_GREENHOUSE.md](REFACTORING_GREENHOUSE.md) - Greenhouse full report
- [REFACTORING_AGRIINO.md](REFACTORING_AGRIINO.md) - Agriino full report (Best Practice)
- [REFACTORING_VISUAL_COMPARISON.md](REFACTORING_VISUAL_COMPARISON.md) - Before/after comparison
- [REFACTORING_GUIDE.md](REFACTORING_GUIDE.md) - Replication guide

## 🛠️ Tech Stack

- **Framework:** React 19.1.1
- **Build Tool:** Vite 7.1.2
- **Styling:** Tailwind CSS 4.1.12
- **UI Components:** Radix UI + shadcn/ui
- **Icons:** Lucide React 0.542.0
- **Charts:** Recharts 3.2.0
- **Notifications:** Sonner 2.0.7

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components:
- Fully customizable
- Built with Radix UI primitives
- Tailwind CSS styled
- TypeScript ready

## 📖 Development Guidelines

### Adding New Features
1. Create feature folder in `src/features/[name]/`
2. Separate data, utils, and components
3. Use shared components from `components/common/`
4. Keep files under 150 lines
5. Add JSDoc comments

### Code Style
- Use ES6+ features
- Functional components with hooks
- Consistent naming conventions
- No code duplication
- Pure utility functions

### Best Practices
- ✅ Component composition over monoliths
- ✅ Separation of concerns (data/logic/UI)
- ✅ Reusable components
- ✅ Clear prop interfaces
- ✅ Single responsibility

## 🧪 Testing

Testing setup (coming soon):
- Unit tests: Jest + React Testing Library
- E2E tests: Playwright
- Component tests: Storybook

## 📝 Documentation

- **Code Documentation:** JSDoc comments in source files
- **Architecture:** See `REFACTORING_*.md` files
- **API Integration:** Coming soon
- **Component Library:** Coming soon

## 🔧 Configuration Files

- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS config
- `eslint.config.js` - ESLint rules
- `package.json` - Dependencies & scripts

## 🚀 Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Build output will be in `dist/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Follow code quality standards
4. Keep components under 150 lines
5. Add JSDoc comments
6. Commit changes (`git commit -m 'Add AmazingFeature'`)
7. Push to branch (`git push origin feature/AmazingFeature`)
8. Open Pull Request

## 📄 License

This project is proprietary software owned by PT Precision Agriculture Indonesia.

## 👥 Team

- **Owner:** RifqiAfandi
- **Repository:** [Precision-Agriculture-Platform-FE](https://github.com/RifqiAfandi/Precision-Agriculture-Platform-FE)
- **Branch:** development

## 📞 Support

For questions or issues:
- Create an issue on GitHub
- Contact: info@agriiweb.com

---

**Project Status:** 🟢 Active Development
**Last Updated:** 2025-10-20
**Code Quality:** 93% (after Agriimeter refactoring)
