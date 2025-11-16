# Production Deployment Checklist

Use this checklist before deploying to production to ensure everything is properly configured and optimized.

## Pre-Deployment

### Code Quality
- [ ] All tests pass (`npm test -- --watchAll=false`)
- [ ] No linter errors (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] No console.log statements in production code
- [ ] No commented-out code
- [ ] No TODO comments that need to be addressed

### Dependencies
- [ ] All dependencies are up to date
- [ ] No security vulnerabilities (`npm audit`)
- [ ] Unused dependencies removed
- [ ] Production dependencies are in `dependencies`, not `devDependencies`

### Environment Variables
- [ ] `.env.example` is up to date
- [ ] `.env` is in `.gitignore`
- [ ] All required environment variables are documented
- [ ] Production environment variables are configured on hosting platform
- [ ] API endpoints point to production
- [ ] Analytics IDs are configured (if using)
- [ ] NEAR network is set to correct environment (testnet/mainnet)

### Security
- [ ] Sensitive data is not in code
- [ ] API keys are in environment variables
- [ ] CORS is properly configured
- [ ] CSP headers are set
- [ ] HTTPS is enforced
- [ ] Security headers are configured
- [ ] Authentication is working
- [ ] Authorization is properly implemented
- [ ] Input validation is in place
- [ ] SQL injection prevention (if applicable)
- [ ] XSS protection is implemented

### Performance
- [ ] Bundle size is optimized
- [ ] Images are optimized and compressed
- [ ] Code splitting is implemented
- [ ] Lazy loading is used for routes
- [ ] React.memo is used for expensive components
- [ ] Service worker is configured
- [ ] Caching strategies are in place
- [ ] Lighthouse score > 90

### SEO & Meta Tags
- [ ] Page title is descriptive
- [ ] Meta description is set
- [ ] Open Graph tags are configured
- [ ] Twitter cards are configured
- [ ] Favicon is present
- [ ] robots.txt is configured
- [ ] Sitemap is available (if applicable)
- [ ] Canonical URLs are set

### PWA
- [ ] manifest.json is configured
- [ ] Service worker is registered
- [ ] App works offline (basic functionality)
- [ ] Icons are present (192x192, 512x512)
- [ ] Theme color is set
- [ ] Installable on mobile devices

### Functionality
- [ ] All features work as expected
- [ ] Forms validate correctly
- [ ] Error handling is in place
- [ ] Loading states are shown
- [ ] Navigation works correctly
- [ ] Deep linking works
- [ ] Browser back button works
- [ ] Authentication flow works
- [ ] NEAR wallet integration works (if using)

### Browser Compatibility
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari
- [ ] Tested in Edge
- [ ] Tested on mobile browsers
- [ ] No console errors in any browser

### Responsive Design
- [ ] Works on desktop (1920px+)
- [ ] Works on laptop (1366px)
- [ ] Works on tablet (768px)
- [ ] Works on mobile (375px)
- [ ] Touch interactions work
- [ ] No horizontal scroll

### Documentation
- [ ] README.md is updated
- [ ] DEPLOYMENT.md is complete
- [ ] CONTRIBUTING.md is present
- [ ] Code is documented
- [ ] API documentation is available (if applicable)
- [ ] Changelog is updated

### Build
- [ ] Production build completes without errors
- [ ] Build output is optimized
- [ ] Source maps are disabled in production
- [ ] Build size is acceptable
- [ ] No warnings in build output

### Deployment Configuration
- [ ] Deployment platform is chosen
- [ ] CI/CD pipeline is set up
- [ ] Deployment secrets are configured
- [ ] Domain is configured (if custom)
- [ ] SSL certificate is active
- [ ] Redirects are configured (www to non-www, etc.)
- [ ] Environment is set to production

### Monitoring & Analytics
- [ ] Error tracking is set up (Sentry, etc.)
- [ ] Analytics is configured (Google Analytics, etc.)
- [ ] Performance monitoring is in place
- [ ] Uptime monitoring is configured
- [ ] Logging is set up

### Backup & Recovery
- [ ] Database backups are configured (if applicable)
- [ ] Rollback plan is documented
- [ ] Version control is up to date
- [ ] Latest stable version is tagged

## Post-Deployment

### Verification
- [ ] Application loads correctly
- [ ] All routes are accessible
- [ ] Environment variables are working
- [ ] API connections work
- [ ] Authentication works
- [ ] Database connections work (if applicable)
- [ ] Third-party integrations work
- [ ] Email sending works (if applicable)
- [ ] File uploads work (if applicable)

### Performance
- [ ] Page load time is acceptable (< 3s)
- [ ] Time to Interactive is good (< 3.5s)
- [ ] First Contentful Paint is fast (< 1.5s)
- [ ] Largest Contentful Paint is fast (< 2.5s)
- [ ] No memory leaks
- [ ] API response times are good

### Testing
- [ ] Run smoke tests
- [ ] Test critical user flows
- [ ] Test on production data
- [ ] Test error scenarios
- [ ] Load testing (if applicable)

### Monitoring
- [ ] Check error tracking dashboard
- [ ] Verify analytics is recording
- [ ] Check performance metrics
- [ ] Verify uptime monitoring
- [ ] Check server logs

### Communication
- [ ] Notify team of deployment
- [ ] Update status page (if applicable)
- [ ] Announce to users (if major update)
- [ ] Document any known issues

## Emergency Rollback

If issues are found:

1. **Immediate Actions**
   - [ ] Rollback to previous version
   - [ ] Notify team
   - [ ] Document the issue

2. **Investigation**
   - [ ] Check error logs
   - [ ] Reproduce the issue
   - [ ] Identify the cause
   - [ ] Create bug report

3. **Fix and Redeploy**
   - [ ] Fix the issue
   - [ ] Test thoroughly
   - [ ] Review this checklist again
   - [ ] Deploy the fix

## Final Sign-off

- [ ] Technical lead approval
- [ ] Product owner approval
- [ ] Security review passed
- [ ] Performance review passed
- [ ] All critical issues resolved

**Deployment Date:** _______________

**Deployed By:** _______________

**Version:** _______________

**Notes:**
_______________________________________________
_______________________________________________
_______________________________________________

## Additional Resources

- [Deployment Guide](./DEPLOYMENT.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [README](./README.md)
- Platform-specific documentation

---

**Remember:** Always deploy during low-traffic hours and have a rollback plan ready!
