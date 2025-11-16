# Deployment Guide

This guide provides detailed instructions for deploying the NCE Startup Dashboard application to various platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build Configuration](#build-configuration)
- [Deployment Options](#deployment-options)
  - [Vercel](#vercel)
  - [Netlify](#netlify)
  - [Docker](#docker)
  - [AWS](#aws)
  - [Google Cloud Platform](#google-cloud-platform)
  - [Azure](#azure)
  - [Traditional Hosting](#traditional-hosting)
- [Environment Variables](#environment-variables)
- [CI/CD Setup](#cicd-setup)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

1. Built and tested the application locally
2. Configured all required environment variables
3. Set up your deployment platform account
4. Reviewed security settings
5. Configured your domain (if using custom domain)

## Build Configuration

### Production Build

Create an optimized production build:

```bash
npm run build:prod
```

This command:
- Creates a production build in the `build` folder
- Minifies JavaScript and CSS
- Optimizes assets
- Disables source maps for security
- Generates service worker

### Build Verification

Test the production build locally:

```bash
npm run serve
```

Visit `http://localhost:3000` to verify the build.

## Deployment Options

### Vercel

Vercel is recommended for its simplicity and automatic deployments.

#### Method 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
npm run deploy:vercel
```

#### Method 2: GitHub Integration

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Configure environment variables
6. Deploy

#### Vercel Configuration

The `vercel.json` file is already configured with:
- Build settings
- Route configurations
- Security headers
- Caching strategies

Environment variables needed:
- `REACT_APP_API_BASE_URL`
- `REACT_APP_NEAR_NETWORK`
- `REACT_APP_GA_TRACKING_ID`

### Netlify

#### Method 1: Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Initialize:
```bash
netlify init
```

4. Deploy:
```bash
npm run deploy:netlify
```

#### Method 2: Drag and Drop

1. Build the application:
```bash
npm run build:prod
```

2. Visit [Netlify Drop](https://app.netlify.com/drop)
3. Drag the `build` folder to the page

#### Method 3: GitHub Integration

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
6. Add environment variables
7. Deploy

The `netlify.toml` file is already configured.

### Docker

#### Local Docker Deployment

1. Build Docker image:
```bash
npm run docker:build
```

2. Run container:
```bash
npm run docker:run
```

3. Access at `http://localhost:80`

#### Docker Compose

Production:
```bash
docker-compose up -d app
```

Development:
```bash
docker-compose --profile dev up -d app-dev
```

#### Docker Hub

1. Login to Docker Hub:
```bash
docker login
```

2. Tag your image:
```bash
docker tag startup-dashboard-app:latest yourusername/startup-dashboard-app:latest
```

3. Push to Docker Hub:
```bash
docker push yourusername/startup-dashboard-app:latest
```

### AWS

#### AWS Elastic Beanstalk

1. Install EB CLI:
```bash
pip install awsebcli
```

2. Initialize:
```bash
eb init
```

3. Create environment:
```bash
eb create production
```

4. Deploy:
```bash
eb deploy
```

#### AWS S3 + CloudFront

1. Build the application:
```bash
npm run build:prod
```

2. Create S3 bucket:
```bash
aws s3 mb s3://your-bucket-name
```

3. Enable static website hosting:
```bash
aws s3 website s3://your-bucket-name --index-document index.html
```

4. Upload build files:
```bash
aws s3 sync build/ s3://your-bucket-name
```

5. Create CloudFront distribution
6. Configure custom domain (optional)

#### AWS Amplify

1. Install Amplify CLI:
```bash
npm install -g @aws-amplify/cli
```

2. Initialize:
```bash
amplify init
```

3. Add hosting:
```bash
amplify add hosting
```

4. Publish:
```bash
amplify publish
```

### Google Cloud Platform

#### Cloud Run (Docker)

1. Build and push Docker image:
```bash
gcloud builds submit --tag gcr.io/PROJECT-ID/startup-dashboard-app
```

2. Deploy to Cloud Run:
```bash
gcloud run deploy startup-dashboard-app \
  --image gcr.io/PROJECT-ID/startup-dashboard-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login:
```bash
firebase login
```

3. Initialize:
```bash
firebase init hosting
```

4. Build and deploy:
```bash
npm run build:prod
firebase deploy
```

### Azure

#### Azure Static Web Apps

1. Install Azure CLI:
```bash
npm install -g @azure/static-web-apps-cli
```

2. Login:
```bash
az login
```

3. Create static web app:
```bash
az staticwebapp create \
  --name startup-dashboard-app \
  --resource-group myResourceGroup \
  --source . \
  --location "Central US" \
  --branch main \
  --app-location "/" \
  --output-location "build"
```

### Traditional Hosting

For Apache, Nginx, or other web servers:

1. Build the application:
```bash
npm run build:prod
```

2. Upload the `build` folder contents to your web server

3. Configure your web server to:
   - Serve `index.html` for all routes
   - Enable gzip compression
   - Set proper cache headers
   - Add security headers

#### Apache (.htaccess)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

#### Nginx

Use the provided `nginx.conf` file or configure:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Environment Variables

Configure these environment variables in your deployment platform:

### Required
- `REACT_APP_API_BASE_URL` - API endpoint
- `REACT_APP_NEAR_NETWORK` - NEAR network (testnet/mainnet)

### Optional
- `REACT_APP_GA_TRACKING_ID` - Google Analytics ID
- `REACT_APP_ENABLE_ANALYTICS` - Enable analytics (true/false)
- `REACT_APP_SENTRY_DSN` - Sentry error tracking
- `GENERATE_SOURCEMAP` - Generate source maps (false for production)

## CI/CD Setup

### GitHub Actions

The `.github/workflows/ci.yml` file is configured for:
- Automated testing on PR
- Production builds
- Security scanning
- Deployment to staging/production

Setup secrets in GitHub:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

### GitLab CI/CD

Create `.gitlab-ci.yml`:

```yaml
image: node:18

stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - npm ci
    - npm test -- --watchAll=false

build:
  stage: build
  script:
    - npm run build:prod
  artifacts:
    paths:
      - build/

deploy:
  stage: deploy
  script:
    - npm run deploy:vercel
  only:
    - main
```

## Post-Deployment

### Verification Checklist

- [ ] Application loads correctly
- [ ] All routes work (SPA routing)
- [ ] Environment variables are set
- [ ] API connections work
- [ ] Authentication works
- [ ] Dark mode toggle works
- [ ] Responsive design works on mobile
- [ ] PWA features work
- [ ] Analytics tracking works
- [ ] Error tracking works
- [ ] Performance metrics are good
- [ ] Security headers are set
- [ ] SSL certificate is active
- [ ] Custom domain works (if applicable)

### Performance Testing

Use these tools to verify performance:
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)
- Chrome Lighthouse (DevTools)

Target scores:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### Monitoring

Set up monitoring for:
- Uptime (UptimeRobot, Pingdom)
- Error tracking (Sentry)
- Analytics (Google Analytics)
- Performance (Web Vitals)

## Troubleshooting

### Build Fails

**Problem**: Build command fails

**Solution**:
- Check Node.js version (should be >= 16)
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf build`
- Check for syntax errors

### 404 on Routes

**Problem**: Direct URL access returns 404

**Solution**:
- Configure server for SPA routing
- Ensure `index.html` is served for all routes
- Check deployment platform documentation

### Environment Variables Not Working

**Problem**: Environment variables are undefined

**Solution**:
- Prefix variables with `REACT_APP_`
- Rebuild after adding variables
- Check platform-specific configuration

### Performance Issues

**Problem**: Slow load times

**Solution**:
- Enable gzip compression
- Check bundle size with `npm run analyze`
- Verify CDN is working
- Check service worker configuration
- Optimize images

### CORS Errors

**Problem**: API calls fail with CORS errors

**Solution**:
- Configure CORS on your API server
- Check API base URL
- Verify environment variables

## Support

For deployment issues:
1. Check platform documentation
2. Review error logs
3. Open an issue on GitHub
4. Contact platform support

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Docker Documentation](https://docs.docker.com/)
- [AWS Documentation](https://aws.amazon.com/documentation/)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/)
