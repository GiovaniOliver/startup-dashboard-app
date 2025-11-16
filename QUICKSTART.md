# Quick Start Guide

Get the NCE Startup Dashboard running in 5 minutes!

## Prerequisites

- Node.js >= 16.x
- npm >= 8.x (or yarn)
- Git

Check your versions:
```bash
node --version
npm --version
```

## 5-Minute Setup

### 1. Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/GiovaniOliver/NCE-Dashboard-Manager.git
cd startup-dashboard-app

# Install dependencies
npm install
```

### 2. Configure Environment (1 minute)

```bash
# Create your environment file
cp .env.example .env
```

Edit `.env` with your settings (optional for local development):
```env
REACT_APP_NAME=NCE Startup Dashboard
REACT_APP_API_BASE_URL=https://api.yourdomain.com
REACT_APP_NEAR_NETWORK=testnet
```

### 3. Start Development Server (1 minute)

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### 4. Explore the App (1 minute)

You're ready to go! Try these features:

- **Dashboard** - View overview and statistics
- **Teams** - Manage startup teams
- **Interns** - Manage intern information
- **Tasks** - Track tasks and assignments
- **Finances** - Monitor budget and expenses

## Common First Steps

### Load Demo Data

Want to see the app with sample data?

```javascript
// In your browser console or create a test page
import { generateDemoData } from './utils/seedData';
import { useDataContext } from './Context/DataContext';

const { loadDemoData } = useDataContext();
const demoData = generateDemoData();
loadDemoData(demoData);
```

### Create Your First Team

1. Navigate to the Teams page
2. Click "Add New Team"
3. Fill in the team details
4. Click "Save"

### Add an Intern

1. Go to "Intern List" in the sidebar
2. Click "Add New Intern"
3. Fill in the form
4. Submit

## Development Workflow

### Making Changes

1. Edit files in `/src`
2. Save - hot reload will update the browser automatically
3. Test your changes

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

## Quick Reference

### Project Structure
```
startup-dashboard-app/
├── public/          # Static files
├── src/
│   ├── Components/  # React components
│   ├── Context/     # State management
│   ├── Pages/       # Page components
│   ├── hooks/       # Custom hooks
│   ├── utils/       # Utility functions
│   └── App.js       # Main app
└── package.json     # Dependencies
```

### Available Scripts

```bash
npm start            # Start development server
npm test             # Run tests
npm run build        # Build for production
npm run lint         # Check code quality
npm run format       # Format code
```

### Important Files

- `src/App.js` - Main application and routing
- `src/Context/DataContext.js` - Data management
- `src/Context/AppContext.js` - UI state
- `.env` - Environment variables
- `package.json` - Dependencies and scripts

## Common Use Cases

### 1. Managing Teams

```javascript
import { useTeams } from './hooks';

function MyComponent() {
  const { teams, createTeam, updateTeam, deleteTeam } = useTeams();

  // Create a team
  createTeam({
    name: 'Engineering',
    description: 'Software development team',
    budget: 100000
  });
}
```

### 2. Working with Interns

```javascript
import { useInterns } from './hooks';

function MyComponent() {
  const { interns, createIntern, getTopPerformers } = useInterns();

  // Get top performers
  const topInterns = getTopPerformers(5);
}
```

### 3. Managing Tasks

```javascript
import { useTasks } from './hooks';

function MyComponent() {
  const { tasks, createTask, getOverdueTasks } = useTasks();

  // Get overdue tasks
  const overdue = getOverdueTasks();
}
```

### 4. Adding Notifications

```javascript
import { useAppContext } from './Context/AppContext';

function MyComponent() {
  const { addNotification } = useAppContext();

  addNotification({
    type: 'success',
    message: 'Operation completed!'
  });
}
```

## Troubleshooting

### Port Already in Use

If port 3000 is busy:
```bash
# Use a different port
PORT=3001 npm start
```

### Dependencies Issues

If you encounter dependency errors:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

If you get MUI-related build errors:
```bash
npm install @mui/material@latest @mui/icons-material@latest
npm install @mui/x-data-grid@latest
```

### Browserslist Warning

```bash
npx browserslist@latest --update-db
```

## Next Steps

Now that you're up and running:

1. **Read the Architecture** - [ARCHITECTURE.md](./ARCHITECTURE.md)
2. **Learn State Management** - [STATE_MANAGEMENT_README.md](./STATE_MANAGEMENT_README.md)
3. **Review Contributing Guide** - [CONTRIBUTING.md](./CONTRIBUTING.md)
4. **Explore the Code** - Start with `/src/App.js`

## Quick Code Examples

### Creating a New Component

```jsx
// src/Components/MyComponent/MyComponent.jsx
import React from 'react';
import './MyComponent.scss';

const MyComponent = ({ title }) => {
  return (
    <div className="my-component">
      <h2>{title}</h2>
    </div>
  );
};

export default MyComponent;
```

### Adding a New Route

```javascript
// In src/App.js
import { lazy } from 'react';

const MyPage = lazy(() => import("./Pages/MyPage/MyPage"));

// In your routes
<Route path="/my-page" element={<MyPage />} />
```

### Using Custom Hooks

```javascript
import { useTeams, useInterns, useTasks } from './hooks';

function Dashboard() {
  const { teamStats } = useTeams();
  const { internStats } = useInterns();
  const { taskStats } = useTasks();

  return (
    <div>
      <h1>Dashboard</h1>
      <div>Teams: {teamStats.total}</div>
      <div>Interns: {internStats.total}</div>
      <div>Tasks: {taskStats.total}</div>
    </div>
  );
}
```

## Development Tips

### Hot Reload
- Save files to see changes instantly
- No need to restart the server

### React DevTools
- Install [React DevTools](https://react.dev/learn/react-developer-tools)
- Inspect component hierarchy and state

### Browser Console
- Check console for errors
- Use `console.log()` for debugging

### Linting
- Run `npm run lint` before committing
- Fix auto-fixable issues with `npm run lint:fix`

## Resources

- **Full Documentation** - [README.md](./README.md)
- **Deployment Guide** - [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Troubleshooting** - [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **API Reference** - [STATE_MANAGEMENT_README.md](./STATE_MANAGEMENT_README.md)

## Getting Help

- **Documentation** - Check [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
- **Issues** - Search existing issues on GitHub
- **Contributing** - See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**Ready to build?** Start by exploring the codebase and making small changes. Happy coding!
