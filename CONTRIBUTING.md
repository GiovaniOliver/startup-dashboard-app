# Contributing to NCE Startup Dashboard

Thank you for considering contributing to the NCE Startup Dashboard! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## Getting Started

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/NCE-Dashboard-Manager.git
cd startup-dashboard-app
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/GiovaniOliver/NCE-Dashboard-Manager.git
```

4. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

## Development Setup

### Prerequisites

- Node.js >= 16.x
- npm >= 8.x
- Git

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm start
```

### Development Workflow

1. Keep your fork synced:
```bash
git fetch upstream
git merge upstream/main
```

2. Make your changes
3. Test your changes
4. Commit your changes
5. Push to your fork
6. Create a pull request

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, browser, Node version)
- **Additional context**

Example bug report:

```markdown
**Description**
Brief description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen

**Actual Behavior**
What actually happened

**Screenshots**
If applicable, add screenshots

**Environment**
- OS: [e.g., macOS 12.0]
- Browser: [e.g., Chrome 95]
- Node: [e.g., 16.13.0]
```

### Suggesting Features

Feature requests are welcome! Please:

1. Check if the feature has already been suggested
2. Provide a clear description of the feature
3. Explain why this feature would be useful
4. Include examples of how it would work

### Improving Documentation

Documentation improvements are always welcome:

- Fix typos or clarify existing documentation
- Add missing documentation
- Translate documentation
- Add code examples

## Coding Standards

### JavaScript/React Style Guide

We follow the Airbnb JavaScript Style Guide with some modifications:

#### General Rules

- Use ES6+ features
- Use functional components with hooks
- Use arrow functions
- Use const/let instead of var
- Use template literals for string interpolation
- Use destructuring when appropriate

#### React Specific

- Use functional components
- Use hooks for state and effects
- Use React.memo for performance optimization
- Use lazy loading for routes
- Keep components small and focused
- Use PropTypes or TypeScript for type checking

#### Naming Conventions

- Components: PascalCase (e.g., `UserProfile.jsx`)
- Functions: camelCase (e.g., `getUserData`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- Files: kebab-case for utilities (e.g., `user-utils.js`)

#### File Structure

```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Component.scss';

// 2. Constants
const DEFAULT_VALUE = 10;

// 3. Component
const MyComponent = ({ prop1, prop2 }) => {
  // 3a. State
  const [state, setState] = useState(null);

  // 3b. Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // 3c. Handlers
  const handleClick = () => {
    // Handler logic
  };

  // 3d. Render
  return (
    <div className="my-component">
      {/* JSX */}
    </div>
  );
};

// 4. Export
export default MyComponent;
```

#### Code Quality

- Write clean, readable code
- Add comments for complex logic
- Avoid code duplication
- Keep functions small and focused
- Use meaningful variable names
- Handle errors appropriately

### CSS/SCSS Guidelines

- Use SCSS for styling
- Follow BEM naming convention
- Use variables for colors and spacing
- Make responsive designs
- Avoid !important
- Group related styles

Example:

```scss
.component {
  // Layout
  display: flex;

  // Box model
  padding: 1rem;
  margin: 0 auto;

  // Typography
  font-size: 1rem;

  // Visual
  background-color: $primary-color;

  // Modifiers
  &--large {
    padding: 2rem;
  }

  // Nested elements
  &__title {
    font-weight: bold;
  }
}
```

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **ci**: CI/CD changes

### Examples

```bash
feat(auth): add NEAR wallet integration

- Add NEAR wallet connection
- Add authentication context
- Add login/logout functionality

Closes #123
```

```bash
fix(navbar): resolve mobile menu overflow issue

The mobile menu was overflowing on smaller screens.
Added max-width and overflow handling.

Fixes #456
```

### Commit Best Practices

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Keep subject line under 50 characters
- Capitalize the subject line
- Don't end subject line with a period
- Separate subject from body with a blank line
- Use body to explain what and why, not how
- Reference issues and pull requests

## Pull Request Process

### Before Submitting

1. Update your branch:
```bash
git fetch upstream
git rebase upstream/main
```

2. Run tests:
```bash
npm test -- --watchAll=false
```

3. Run linter:
```bash
npm run lint
```

4. Build the project:
```bash
npm run build
```

### Creating a Pull Request

1. Push your branch to your fork
2. Go to the original repository
3. Click "New Pull Request"
4. Select your fork and branch
5. Fill out the PR template
6. Link related issues
7. Request reviewers

### PR Title Format

Follow commit message format:

```
feat(component): add new feature
fix(bug): resolve issue with...
docs(readme): update installation instructions
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] No console errors

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests pass

## Related Issues
Closes #issue_number
```

### Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, a maintainer will merge
4. Your contribution will be included in the next release

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage --watchAll=false

# Run specific test file
npm test -- ComponentName.test.js
```

### Writing Tests

- Write tests for new features
- Write tests for bug fixes
- Aim for high code coverage
- Test edge cases
- Use descriptive test names

Example test:

```javascript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle click events', () => {
    // Test implementation
  });

  it('should validate input', () => {
    // Test implementation
  });
});
```

## Documentation

### Code Documentation

- Add JSDoc comments for functions
- Document complex algorithms
- Add README for new features
- Update existing documentation

Example:

```javascript
/**
 * Fetches user data from the API
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} User data object
 * @throws {Error} If the API request fails
 */
async function getUserData(userId) {
  // Implementation
}
```

### README Updates

Update README.md when:
- Adding new features
- Changing setup process
- Updating dependencies
- Adding new scripts

## Issue Reporting

### Good Issue Reports Include

1. **Clear title**: Summarize the issue
2. **Description**: Detailed explanation
3. **Steps to reproduce**: Numbered steps
4. **Expected behavior**: What should happen
5. **Actual behavior**: What actually happens
6. **Environment**: OS, browser, versions
7. **Screenshots**: If applicable
8. **Possible solution**: If you have ideas

## Questions?

If you have questions:

1. Check existing documentation
2. Search closed issues
3. Ask in discussions
4. Open a new issue

## Recognition

Contributors will be:
- Listed in the contributors section
- Mentioned in release notes
- Acknowledged in the community

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to NCE Startup Dashboard!
