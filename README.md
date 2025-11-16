# NCE Startup Dashboard Management

A comprehensive, production-ready startup dashboard management system built with React and NEAR Protocol integration. This application provides a powerful interface for managing teams, tasks, resources, and blockchain-based authentication.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![React](https://img.shields.io/badge/react-18.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

- **Modern React Architecture**: Built with React 18, React Router v6, and Material-UI
- **NEAR Protocol Integration**: Blockchain-based authentication with NEAR wallet
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first design that works on all devices
- **PWA Ready**: Progressive Web App with offline support
- **Performance Optimized**: Code splitting, lazy loading, and React.memo optimization
- **Type-Safe**: ESLint configuration for code quality
- **Analytics Ready**: Built-in Google Analytics integration (placeholder)
- **Security Hardened**: CSP headers, security best practices
- **Docker Support**: Containerized deployment ready
- **CI/CD Pipeline**: GitHub Actions for automated testing and deployment

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Performance Optimization](#performance-optimization)
- [Contributing](#contributing)

## Getting Started

### Prerequisites

- Node.js >= 16.x
- npm >= 8.x or yarn >= 1.22.x
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/GiovaniOliver/NCE-Dashboard-Manager.git
cd startup-dashboard-app
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables (see [Environment Variables](#environment-variables))

## Development

Start the development server:

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm start` - Start development server
- `npm test` - Run tests in watch mode
- `npm run build` - Build for production
- `npm run build:prod` - Build for production without source maps
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run analyze` - Analyze bundle size
- `npm run serve` - Serve production build locally
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run Docker container
- `npm run docker:dev` - Run development in Docker
- `npm run docker:prod` - Run production in Docker
- `npm run deploy:vercel` - Deploy to Vercel
- `npm run deploy:netlify` - Deploy to Netlify

### Docker Development

Run the app in Docker development mode:

```bash
npm run docker:dev
```

## Building for Production

Build the application for production:

```bash
npm run build:prod
```

This creates an optimized production build in the `build` folder with:
- Minified JavaScript and CSS
- Optimized assets
- Service worker for offline support
- No source maps for security

### Analyze Bundle Size

To analyze what's in your bundle:

```bash
npm run build:analyze
```

## Deployment

### Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
npm run deploy:vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
npm run deploy:netlify
```

Or drag and drop the `build` folder to [Netlify Drop](https://app.netlify.com/drop).

### Docker

Build and run with Docker:

```bash
# Build Docker image
npm run docker:build

# Run container
npm run docker:run
```

Or use Docker Compose:

```bash
# Production
npm run docker:prod

# Development
npm run docker:dev
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment guides.

## Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm test -- --coverage --watchAll=false
```

## Environment Variables

Create a `.env` file in the root directory. See `.env.example` for all available options.

### Required Variables

```env
REACT_APP_NAME=NCE Startup Dashboard
REACT_APP_API_BASE_URL=https://api.yourdomain.com
REACT_APP_NEAR_NETWORK=testnet
```

### Optional Variables

```env
REACT_APP_GA_TRACKING_ID=G-XXXXXXXXXX
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_SENTRY_DSN=https://xxx@sentry.io/xxx
```

## Project Structure

```
startup-dashboard-app/
├── public/              # Static files
├── src/
│   ├── Components/      # Reusable components
│   │   ├── header/
│   │   ├── navbar/
│   │   ├── sidebar/
│   │   └── widget/
│   ├── Context/         # React Context providers
│   ├── Pages/           # Page components
│   │   ├── Home/
│   │   ├── List/
│   │   ├── Login/
│   │   ├── New/
│   │   └── Single/
│   ├── utils/           # Utility functions
│   │   ├── analytics.js
│   │   └── performanceMonitor.js
│   ├── App.js           # Main app component
│   └── index.js         # Entry point
├── .github/             # GitHub Actions workflows
├── docker-compose.yml   # Docker Compose configuration
├── Dockerfile           # Production Docker image
├── nginx.conf           # Nginx configuration
└── package.json         # Dependencies and scripts
```

## Performance Optimization

This application implements several performance optimizations:

1. **Code Splitting**: Routes are lazy-loaded using React.lazy()
2. **Component Memoization**: Expensive components use React.memo()
3. **Bundle Optimization**: Webpack optimizations for smaller bundle size
4. **Caching Strategy**: Service worker for offline support
5. **Performance Monitoring**: Built-in performance tracking utilities

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security

This application implements security best practices:

- Content Security Policy (CSP)
- XSS Protection
- HTTPS enforcement
- Secure headers (X-Frame-Options, etc.)
- Environment variable protection

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## Support

For support, open an issue in the GitHub repository.

## Authors

- NCE Dashboard Team

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
