# Application Architecture

This document describes the architecture of the NCE Startup Dashboard application.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Architecture Patterns](#architecture-patterns)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [Component Architecture](#component-architecture)
- [Routing](#routing)
- [Performance Optimizations](#performance-optimizations)
- [Security](#security)

## Overview

The NCE Startup Dashboard is a single-page application (SPA) built with React that provides comprehensive management tools for startup teams, interns, tasks, and finances.

### Key Characteristics

- **Single Page Application** - Client-side routing with React Router
- **Component-Based** - Modular, reusable React components
- **Context-Based State** - Centralized state management with React Context API
- **Progressive Web App** - Offline support with service workers
- **Responsive Design** - Mobile-first, works on all devices

## Technology Stack

### Core Technologies

- **React 18.1.0** - UI library
- **React Router v6** - Client-side routing
- **React Context API** - State management
- **SCSS** - Styling with preprocessor
- **localStorage** - Data persistence

### UI Components

- **Material-UI (MUI)** - Component library and icons
- **Custom Components** - Application-specific UI elements

### Build Tools

- **Create React App** - Build configuration
- **Webpack** - Module bundling (via CRA)
- **Babel** - JavaScript transpilation (via CRA)

### Testing

- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **Testing utilities** - Custom test helpers

### DevOps

- **Docker** - Containerization
- **Nginx** - Production web server
- **GitHub Actions** - CI/CD pipeline
- **Vercel/Netlify** - Deployment platforms

### External Integrations

- **NEAR Protocol** - Blockchain authentication
- **Google Analytics** - Analytics tracking
- **Sentry** (optional) - Error tracking

## Project Structure

```
startup-dashboard-app/
├── public/                     # Static files
│   ├── index.html             # HTML entry point
│   ├── manifest.json          # PWA manifest
│   ├── robots.txt             # SEO directives
│   └── browserconfig.xml      # Windows tile config
│
├── src/                        # Source code
│   ├── Components/            # Reusable components
│   │   ├── header/           # Header component
│   │   ├── navbar/           # Navigation bar
│   │   ├── sidebar/          # Sidebar navigation
│   │   ├── widget/           # Dashboard widgets
│   │   ├── Toast/            # Notification toasts
│   │   ├── ConfirmDialog/    # Confirmation dialogs
│   │   ├── LoadingSpinner/   # Loading states
│   │   ├── ErrorBoundary/    # Error boundaries
│   │   ├── internComponents/ # Intern-specific components
│   │   ├── TaskTimeline/     # Task timeline view
│   │   ├── TaskCost/         # Task cost tracker
│   │   ├── BudgetManager/    # Budget management
│   │   ├── Reports/          # Reporting components
│   │   └── Tools/            # Utility components
│   │
│   ├── Pages/                 # Page components
│   │   ├── Home/             # Dashboard home
│   │   ├── Login/            # Authentication
│   │   ├── List/             # User list
│   │   ├── Single/           # User detail
│   │   ├── New/              # New user
│   │   ├── InternList/       # Intern list
│   │   ├── InternSingle/     # Intern detail
│   │   ├── InternNew/        # New/edit intern
│   │   ├── InternPayout/     # Intern payments
│   │   ├── TaskDashboard/    # Task overview
│   │   ├── TaskDetail/       # Task detail
│   │   ├── TaskNew/          # New/edit task
│   │   ├── TeamPayout/       # Team payments
│   │   ├── FinancialOverview/ # Financial dashboard
│   │   ├── CourseModule/     # Course management
│   │   ├── LearnCenter/      # Learning center
│   │   ├── Resources/        # Resources library
│   │   └── Help/             # Help & support
│   │
│   ├── Context/               # State management
│   │   ├── AppContext.js     # Global app state
│   │   ├── DataContext.js    # Data management
│   │   ├── AuthContext.jsx   # Authentication state
│   │   └── DarkModeContext.js # Theme state
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── index.js          # Hook exports
│   │   ├── useTeams.js       # Team operations
│   │   ├── useInterns.js     # Intern operations
│   │   ├── useTasks.js       # Task operations
│   │   └── useFinances.js    # Finance operations
│   │
│   ├── utils/                 # Utility functions
│   │   ├── storage.js        # localStorage management
│   │   ├── dataManager.js    # Data operations
│   │   ├── sync.js           # Data synchronization
│   │   ├── history.js        # Undo/redo
│   │   ├── seedData.js       # Demo data
│   │   ├── validation.js     # Form validation
│   │   ├── sanitize.js       # Input sanitization
│   │   ├── errorHandler.js   # Error handling
│   │   ├── analytics.js      # Analytics tracking
│   │   ├── performanceMonitor.js # Performance monitoring
│   │   └── testUtils.js      # Testing utilities
│   │
│   ├── data/                  # Static data
│   │   └── internData.js     # Sample intern data
│   │
│   ├── examples/              # Example code
│   │   └── StateManagementExamples.js
│   │
│   ├── __tests__/             # Test files
│   │   └── integration/      # Integration tests
│   │
│   ├── App.js                 # Main app component
│   ├── index.js               # Entry point
│   ├── App.scss               # Global styles
│   ├── service-worker.js     # PWA service worker
│   └── serviceWorkerRegistration.js
│
├── .github/                   # GitHub configuration
│   └── workflows/            # CI/CD workflows
│       ├── ci.yml           # Main CI/CD pipeline
│       └── codeql.yml       # Security scanning
│
├── Configuration Files
│   ├── package.json          # Dependencies & scripts
│   ├── .env.example          # Environment template
│   ├── .gitignore           # Git ignore rules
│   ├── Dockerfile           # Production Docker image
│   ├── Dockerfile.dev       # Development Docker image
│   ├── docker-compose.yml   # Docker orchestration
│   ├── nginx.conf           # Nginx configuration
│   ├── vercel.json          # Vercel deployment
│   └── netlify.toml         # Netlify deployment
│
└── Documentation
    ├── README.md                        # Main documentation
    ├── DOCUMENTATION_INDEX.md           # Documentation index
    ├── QUICKSTART.md                    # Quick start guide
    ├── ARCHITECTURE.md                  # This file
    ├── DEPLOYMENT.md                    # Deployment guide
    ├── CONTRIBUTING.md                  # Contributing guide
    ├── TROUBLESHOOTING.md               # Troubleshooting guide
    ├── BUILD_FIXES.md                   # Build fixes
    ├── PRODUCTION_CHECKLIST.md          # Deployment checklist
    ├── STATE_MANAGEMENT_README.md       # State management docs
    ├── QUICK_REFERENCE.md               # State quick reference
    ├── INTERN_MODULE_SUMMARY.md         # Intern module docs
    ├── INTERN_MODULE_QUICK_REFERENCE.md # Intern quick reference
    ├── TESTING_QA_SUMMARY.md            # Testing docs
    └── PRODUCTION_OPTIMIZATION_SUMMARY.md # Optimization docs
```

## Architecture Patterns

### 1. Component-Based Architecture

The application follows a component-based architecture where:

- **Components are self-contained** - Each component manages its own logic and styling
- **Props flow down** - Data flows from parent to child components
- **Events flow up** - Child components communicate with parents via callbacks
- **Composition over inheritance** - Components are composed together

### 2. Container-Presentation Pattern

- **Container Components** (Pages) - Handle logic and state
- **Presentational Components** (Components) - Focus on UI rendering

### 3. Context Pattern

- **Global State** - Shared via React Context
- **Local State** - Managed with useState/useReducer
- **Derived State** - Computed with useMemo

### 4. Custom Hooks Pattern

- **Encapsulate logic** - Reusable stateful logic
- **Separation of concerns** - Business logic separate from UI
- **Composition** - Hooks can use other hooks

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                       │
│                    (React Components)                     │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────┐
│                    Custom Hooks                          │
│         (useTeams, useInterns, useTasks, etc.)          │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────┐
│                 Context Providers                        │
│            (DataContext, AppContext)                     │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────┐
│                  Data Utilities                          │
│        (dataManager, validation, sanitization)          │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────┐
│                localStorage (Persistence)                │
└─────────────────────────────────────────────────────────┘
```

### Data Flow Steps

1. **User Interaction** - User interacts with UI component
2. **Component** - Calls custom hook function
3. **Custom Hook** - Uses context to access/modify data
4. **Context** - Updates state and validates data
5. **Data Utilities** - Process and validate changes
6. **Storage** - Persist to localStorage
7. **Re-render** - Context notifies components of changes
8. **UI Update** - Components re-render with new data

## State Management

### Global State (Context API)

#### AppContext
Manages UI and application state:
- Sidebar visibility
- Active view
- Notifications
- Modals/dialogs
- User preferences
- Theme
- Search/filters

#### DataContext
Manages application data:
- Teams
- Interns
- Tasks
- Finances
- CRUD operations
- Data validation
- Auto-save

#### AuthContext
Manages authentication:
- User session
- Login/logout
- NEAR wallet integration

#### DarkModeContext
Manages theme:
- Light/dark mode
- Theme persistence

### Local State (useState/useReducer)

Used for:
- Form inputs
- UI component state
- Temporary data
- Loading states
- Error states

### Derived State (useMemo)

Computed from existing state:
- Statistics
- Filtered lists
- Sorted data
- Aggregations

## Component Architecture

### Component Categories

#### 1. Layout Components
- **Header** - Top navigation
- **Sidebar** - Side navigation
- **Navbar** - User menu

#### 2. Page Components
- **Full-page views** - Dashboard, List, Detail, Form pages
- **Route-specific** - Bound to specific URLs
- **Data-fetching** - Load and manage page-level data

#### 3. Feature Components
- **Domain-specific** - InternTaskCard, BudgetManager
- **Business logic** - Contains feature-specific logic

#### 4. UI Components
- **Reusable** - LoadingSpinner, Toast, ConfirmDialog
- **Presentation-only** - Focus on display
- **Generic** - Not tied to specific features

#### 5. Higher-Order Components
- **ErrorBoundary** - Error catching
- **ProtectedRoute** - Authentication guard

### Component Lifecycle

```
Mount → Render → Update → Unmount
   ↓       ↓        ↓        ↓
useEffect hooks execute accordingly
```

### Component Communication

- **Parent → Child** - Props
- **Child → Parent** - Callback functions
- **Sibling → Sibling** - Via parent or context
- **Any → Any** - Via context

## Routing

### Router Configuration

```javascript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="users" element={<List />} />
        <Route path="users/:userId" element={<Single />} />
        <Route path="users/new" element={<New />} />

        <Route path="interns" element={<InternList />} />
        <Route path="interns/:internId" element={<InternSingle />} />
        <Route path="interns/new" element={<InternNew />} />

        {/* More routes... */}
      </Route>
    </Route>
  </Routes>
</BrowserRouter>
```

### Route Types

- **Public Routes** - Login, registration
- **Protected Routes** - Require authentication
- **Nested Routes** - Parent-child relationships
- **Dynamic Routes** - With URL parameters

### Route Guards

- **ProtectedRoute** - Authentication check
- **Redirect** - Unauthenticated users → Login

## Performance Optimizations

### 1. Code Splitting

```javascript
// Lazy loading routes
const Home = lazy(() => import("./Pages/Home/home"));
const List = lazy(() => import("./Pages/List/list"));
```

### 2. Component Memoization

```javascript
// Prevent unnecessary re-renders
export default React.memo(Widget);
```

### 3. useMemo Hook

```javascript
// Memoize expensive calculations
const teamStats = useMemo(() => calculateStats(teams), [teams]);
```

### 4. useCallback Hook

```javascript
// Memoize callback functions
const handleClick = useCallback(() => {
  // Handle click
}, [dependencies]);
```

### 5. Service Worker

- Offline support
- Cache-first strategy
- Background sync

### 6. Bundle Optimization

- Minification
- Tree shaking
- Compression (gzip)

## Security

### 1. Input Validation

- Form validation
- Type checking
- Range validation

### 2. Input Sanitization

- XSS prevention
- HTML escaping
- SQL injection prevention

### 3. Authentication

- NEAR wallet integration
- Session management
- Protected routes

### 4. Security Headers

- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

### 5. Environment Variables

- Sensitive data in env vars
- Never commit secrets
- Separate dev/prod configs

## Key Design Decisions

### Why React Context over Redux?

- **Simpler** - Less boilerplate
- **Built-in** - No external dependency
- **Sufficient** - Meets our state management needs
- **Performance** - Good enough for our scale

### Why localStorage over Backend?

- **Simplicity** - No backend infrastructure needed
- **Offline-first** - Works without internet
- **Fast** - No network latency
- **Demo-friendly** - Easy to try out

### Why SCSS over CSS-in-JS?

- **Familiar** - Standard CSS syntax
- **Nesting** - Better organization
- **Variables** - Reusable values
- **Performance** - No runtime overhead

### Why Create React App?

- **Zero config** - Works out of the box
- **Best practices** - Optimized build
- **Maintained** - Active community support
- **Ejectable** - Can customize if needed

## Scaling Considerations

### Current Architecture Supports

- Small to medium teams (< 100 users)
- Moderate data volume (< 10,000 records)
- Single user per browser (localStorage limitation)

### To Scale Up, Consider

1. **Backend API** - Replace localStorage with REST/GraphQL API
2. **Database** - PostgreSQL, MongoDB, or similar
3. **State Management** - Consider Redux/Zustand for complex state
4. **Real-time** - WebSockets for live updates
5. **Caching** - Redis for performance
6. **CDN** - Cloudflare, CloudFront for assets
7. **Monitoring** - Better observability tools

## Development Workflow

1. **Feature Branch** - Create feature branch
2. **Develop** - Build feature with tests
3. **Lint** - Check code quality
4. **Test** - Run test suite
5. **PR** - Create pull request
6. **Review** - Code review
7. **CI/CD** - Automated checks
8. **Merge** - Merge to main
9. **Deploy** - Automatic deployment

## Further Reading

- [State Management Guide](./STATE_MANAGEMENT_README.md)
- [Component Examples](./src/examples/)
- [Testing Guide](./TESTING_QA_SUMMARY.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

This architecture is designed to be maintainable, scalable, and developer-friendly while providing a solid foundation for a production-ready application.
