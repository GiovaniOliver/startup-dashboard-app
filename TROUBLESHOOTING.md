# Troubleshooting Guide

Common issues and solutions for the NCE Startup Dashboard application.

## Table of Contents

- [Build Issues](#build-issues)
- [Runtime Errors](#runtime-errors)
- [Development Issues](#development-issues)
- [Deployment Issues](#deployment-issues)
- [Performance Issues](#performance-issues)
- [Data & Storage Issues](#data--storage-issues)
- [Authentication Issues](#authentication-issues)
- [UI/UX Issues](#uiux-issues)
- [FAQ](#faq)

## Build Issues

### MUI Dependency Compatibility Error

**Error:**
```
Module not found: Error: Can't resolve '@mui/material/Unstable_TrapFocus'
```

**Cause:** Version mismatch between @mui/material and @mui/x-data-grid

**Solutions:**

Option 1 - Update to latest (Recommended):
```bash
npm install @mui/material@latest @mui/icons-material@latest
npm install @mui/x-data-grid@latest
```

Option 2 - Use compatible versions:
```bash
npm install @mui/material@^5.15.0
npm install @mui/x-data-grid@^6.19.0
```

Option 3 - Fresh install:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Browserslist Database Outdated

**Warning:**
```
Browserslist: caniuse-lite is outdated. Please run: npx browserslist@latest --update-db
```

**Solution:**
```bash
npx browserslist@latest --update-db
```

### Build Out of Memory

**Error:**
```
FATAL ERROR: JavaScript heap out of memory
```

**Solutions:**

Increase Node memory limit:
```bash
# Linux/Mac
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Windows (CMD)
set NODE_OPTIONS=--max-old-space-size=4096 && npm run build

# Windows (PowerShell)
$env:NODE_OPTIONS="--max-old-space-size=4096"; npm run build
```

Or update package.json:
```json
{
  "scripts": {
    "build": "cross-env NODE_OPTIONS=--max-old-space-size=4096 react-scripts build"
  }
}
```

Then install cross-env:
```bash
npm install --save-dev cross-env
```

### Dependencies Won't Install

**Error:** Various npm install errors

**Solutions:**

1. Clear npm cache:
```bash
npm cache clean --force
```

2. Delete lock file and node_modules:
```bash
rm -rf node_modules package-lock.json
npm install
```

3. Use legacy peer deps (if peer dependency conflicts):
```bash
npm install --legacy-peer-deps
```

4. Check Node version:
```bash
node --version  # Should be >= 16.x
npm --version   # Should be >= 8.x
```

### ESLint Errors

**Error:** Various linting errors

**Solutions:**

1. Auto-fix:
```bash
npm run lint:fix
```

2. Check specific files:
```bash
npx eslint src/path/to/file.js
```

3. Ignore temporarily (NOT recommended for production):
Add to file:
```javascript
/* eslint-disable */
```

## Runtime Errors

### White Screen / Blank Page

**Symptoms:** Application loads but shows blank page

**Solutions:**

1. Check browser console for errors
2. Clear browser cache and reload
3. Check if JavaScript is enabled
4. Verify build was successful
5. Check service worker isn't caching old version:
```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
  }
});
```

### React Router 404 on Refresh

**Symptom:** Page works when navigating in app, but 404 on direct URL or refresh

**Cause:** Server not configured for SPA routing

**Solutions:**

See [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting) for platform-specific solutions.

General fix - ensure server serves index.html for all routes.

### Context Provider Errors

**Error:**
```
Cannot read property 'X' of undefined
```

**Cause:** Component using context hook outside of provider

**Solution:**

Ensure your component is wrapped in the provider:
```jsx
// In src/index.js
<AppContextProvider>
  <DataContextProvider>
    <App />
  </DataContextProvider>
</AppContextProvider>
```

### localStorage Not Working

**Symptoms:** Data doesn't persist between sessions

**Solutions:**

1. Check browser localStorage is enabled
2. Check storage quota:
```javascript
// In browser console
navigator.storage.estimate().then(estimate => {
  console.log('Used:', estimate.usage);
  console.log('Quota:', estimate.quota);
  console.log('Percentage:', (estimate.usage / estimate.quota * 100).toFixed(2) + '%');
});
```

3. Clear old data:
```javascript
localStorage.clear();
```

4. Check for QuotaExceededError in console

## Development Issues

### Port Already in Use

**Error:**
```
Port 3000 is already in use
```

**Solutions:**

1. Use different port:
```bash
PORT=3001 npm start
```

2. Kill process on port 3000:
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Hot Reload Not Working

**Symptoms:** Changes don't reflect automatically

**Solutions:**

1. Restart development server
2. Check file is saved
3. Clear browser cache
4. Check .env file has FAST_REFRESH=true
5. Disable browser extensions

### Module Not Found

**Error:**
```
Module not found: Can't resolve 'X'
```

**Solutions:**

1. Check import path is correct
2. Check file exists
3. Check case sensitivity (imports are case-sensitive)
4. Restart development server
5. Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Deployment Issues

### Environment Variables Not Working

**Symptoms:** process.env.REACT_APP_X is undefined

**Solutions:**

1. Ensure variables start with REACT_APP_
2. Restart development server after adding variables
3. Check .env file is in root directory
4. For production, set variables in deployment platform
5. Don't put quotes around values in .env:
```bash
# Correct
REACT_APP_API_URL=https://api.example.com

# Incorrect
REACT_APP_API_URL="https://api.example.com"
```

### Build Works Locally But Fails in Production

**Solutions:**

1. Check Node version matches between environments
2. Use exact versions in package.json (remove ^ and ~)
3. Commit package-lock.json
4. Check environment variables are set in production
5. Run production build locally:
```bash
npm run build
npm run serve
```

### Deployment Timeouts

**Cause:** Build taking too long

**Solutions:**

1. Increase timeout in platform settings
2. Optimize build:
   - Remove source maps: `GENERATE_SOURCEMAP=false`
   - Reduce bundle size
   - Use build cache if available

### CORS Errors in Production

**Error:**
```
Access to fetch at 'X' from origin 'Y' has been blocked by CORS policy
```

**Solutions:**

1. Configure CORS on API server
2. Check API URL is correct
3. Verify environment variables
4. Use proxy in development if needed

## Performance Issues

### Slow Initial Load

**Solutions:**

1. Check bundle size:
```bash
npm run build:analyze
```

2. Implement code splitting (already done for routes)
3. Optimize images
4. Enable gzip compression on server
5. Use CDN for static assets
6. Check network tab in DevTools

### Slow Runtime Performance

**Solutions:**

1. Use React DevTools Profiler
2. Check for unnecessary re-renders
3. Use React.memo for expensive components
4. Use useMemo for expensive calculations
5. Use useCallback for callbacks passed to child components
6. Virtualize long lists
7. Debounce expensive operations

### Memory Leaks

**Symptoms:** Page becomes slow over time

**Solutions:**

1. Clean up effects:
```javascript
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe(); // Cleanup
}, []);
```

2. Cancel async operations in cleanup
3. Remove event listeners in cleanup
4. Check for circular references
5. Use Chrome DevTools Memory profiler

## Data & Storage Issues

### Data Not Saving

**Solutions:**

1. Check browser console for errors
2. Verify localStorage is enabled
3. Check storage quota
4. Verify auto-save is enabled
5. Force manual save:
```javascript
import { syncToStorage } from './utils/sync';
syncToStorage(data);
```

### Data Corruption

**Symptoms:** Invalid data, errors on load

**Solutions:**

1. Clear localStorage and start fresh:
```javascript
localStorage.clear();
// Reload page
```

2. Export data before clearing:
```javascript
import { downloadDataAsJson } from './utils/storage';
downloadDataAsJson('backup.json');
```

3. Validate and fix data integrity:
```javascript
import { validateDataIntegrity, fixDataIntegrity } from './utils/sync';
const validation = validateDataIntegrity(data);
if (!validation.isValid) {
  const fixed = fixDataIntegrity(data);
}
```

### Import Not Working

**Symptoms:** Imported data doesn't load

**Solutions:**

1. Verify JSON format is correct
2. Check file size isn't too large
3. Validate data structure matches expected format
4. Check browser console for validation errors

## Authentication Issues

### Can't Connect NEAR Wallet

**Solutions:**

1. Check NEAR network is correct (testnet/mainnet)
2. Verify NEAR wallet extension is installed
3. Clear browser cache
4. Check environment variable:
```bash
REACT_APP_NEAR_NETWORK=testnet
```

5. Try different browser

### Session Not Persisting

**Solutions:**

1. Check localStorage for auth token
2. Verify auth context is properly set up
3. Check protected routes configuration
4. Clear cookies and try again

## UI/UX Issues

### Dark Mode Not Working

**Solutions:**

1. Check DarkModeContext is provided
2. Verify toggle function is called
3. Check localStorage for theme preference
4. Clear browser cache

### Responsive Design Issues

**Solutions:**

1. Check viewport meta tag in index.html
2. Test in browser responsive mode
3. Verify media queries in CSS/SCSS
4. Check for fixed widths preventing responsiveness
5. Test on actual device

### Icons Not Displaying

**Solutions:**

1. Verify @mui/icons-material is installed
2. Check import statements
3. Clear browser cache
4. Check network tab for failed requests

### Sidebar Not Toggling

**Solutions:**

1. Check AppContext is providing toggleSidebar
2. Verify sidebar state
3. Check CSS classes
4. Check z-index conflicts

## FAQ

### How do I reset the application to default state?

```javascript
localStorage.clear();
// Reload page
```

### How do I enable debug mode?

Set in browser console:
```javascript
localStorage.setItem('debug', 'true');
```

### How do I check the current version?

Check package.json or:
```javascript
console.log(process.env.REACT_APP_VERSION);
```

### How do I report a bug?

1. Check if issue exists in GitHub Issues
2. Gather information:
   - Error message
   - Steps to reproduce
   - Browser and OS
   - Console errors
3. Create new issue with template

### Where are logs stored?

- **Development**: Browser console
- **Production**: Configure error tracking (Sentry, etc.)

### How do I enable analytics in development?

Analytics are disabled in development by default. To enable:
1. Set `NODE_ENV=production` (not recommended)
2. Or modify analytics.js to allow development tracking

### How do I clear the service worker cache?

```javascript
// In browser console
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key));
});
```

### Application won't start after update

```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm start
```

## Still Having Issues?

1. **Check Documentation**
   - [README.md](./README.md)
   - [DEPLOYMENT.md](./DEPLOYMENT.md)
   - [BUILD_FIXES.md](./BUILD_FIXES.md)

2. **Search Existing Issues**
   - GitHub Issues
   - Stack Overflow

3. **Get Help**
   - Open a new GitHub Issue
   - Include error messages and steps to reproduce
   - Provide environment details

4. **Debug Tips**
   - Check browser console
   - Use React DevTools
   - Enable verbose logging
   - Test in incognito mode
   - Try different browser

---

**Remember:** Always check the browser console first - it usually contains helpful error messages!
