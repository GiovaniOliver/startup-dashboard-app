# Build Fixes and Known Issues

## Current Build Issue

### Issue: MUI X Data Grid Compatibility

**Error:**
```
Module not found: Error: Can't resolve '@mui/material/Unstable_TrapFocus'
```

**Cause:**
The @mui/x-data-grid package has a version mismatch with @mui/material.

**Solutions:**

#### Option 1: Update MUI Dependencies (Recommended)

```bash
npm install @mui/material@latest @mui/icons-material@latest
npm install @mui/x-data-grid@latest
```

#### Option 2: Downgrade Data Grid

```bash
npm install @mui/x-data-grid@6.19.0
```

#### Option 3: Use Stable Version

Update package.json:
```json
{
  "dependencies": {
    "@mui/material": "^5.15.0",
    "@mui/x-data-grid": "^6.19.0"
  }
}
```

Then run:
```bash
npm install
```

### Temporary Workaround

If you need to build immediately without the data grid:

1. Comment out or remove data grid imports temporarily
2. Run the build
3. Fix the dependency issue
4. Restore the imports

## Other Potential Issues

### Browserslist Outdated

**Warning:**
```
Browserslist: caniuse-lite is outdated
```

**Fix:**
```bash
npx browserslist@latest --update-db
```

### Service Worker Registration

If you get errors related to service worker:

**Solution:**
```bash
# Create the service worker file if it doesn't exist
touch public/service-worker.js
```

Or disable service worker registration in `src/index.js` by changing:
```javascript
serviceWorkerRegistration.register({...});
```
to:
```javascript
serviceWorkerRegistration.unregister();
```

### Build Size Warnings

If you get warnings about chunk size:

**Solutions:**
1. Review bundle with `npm run analyze`
2. Add code splitting for large components
3. Lazy load heavy dependencies
4. Use dynamic imports

### Memory Issues During Build

If build fails with "JavaScript heap out of memory":

**Fix:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
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

## Build Performance Tips

### Faster Builds

1. **Disable Source Maps in Development:**
   Add to `.env.development`:
   ```
   GENERATE_SOURCEMAP=false
   ```

2. **Use npm ci Instead of npm install:**
   ```bash
   npm ci
   ```

3. **Clear Cache:**
   ```bash
   rm -rf node_modules/.cache
   ```

### Optimize Dependencies

1. **Remove Unused Dependencies:**
   ```bash
   npm install -g depcheck
   depcheck
   ```

2. **Update Dependencies:**
   ```bash
   npm update
   ```

3. **Check for Duplicates:**
   ```bash
   npm dedupe
   ```

## Testing the Build

After fixing issues, test the build:

```bash
# Build
npm run build

# Test locally
npm run serve

# Analyze bundle
npm run build:analyze
```

## Production Build Checklist

- [ ] All dependencies are compatible
- [ ] No build errors
- [ ] No build warnings (or documented)
- [ ] Bundle size is acceptable
- [ ] Service worker works
- [ ] Environment variables are set
- [ ] Build output is optimized

## Getting Help

If you encounter other issues:

1. Check the error message carefully
2. Search for the error in:
   - Stack Overflow
   - GitHub Issues for the packages
   - Create React App documentation
3. Check package versions compatibility
4. Try clearing cache and reinstalling
5. Open an issue with full error details

## Useful Commands

```bash
# Clear everything and start fresh
rm -rf node_modules package-lock.json
npm install

# Update browserslist
npx browserslist@latest --update-db

# Check for security issues
npm audit
npm audit fix

# Update specific package
npm install package-name@latest

# Check outdated packages
npm outdated
```

## Notes

- Always test the build locally before deploying
- Keep dependencies updated regularly
- Document any custom fixes or workarounds
- Use exact versions in package.json for production stability
