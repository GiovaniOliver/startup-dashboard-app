# Testing Guidelines

## Overview

This project uses Jest and React Testing Library for comprehensive testing. Our testing strategy includes unit tests, integration tests, and accessibility tests to ensure high code quality and reliability.

## Test Structure

```
src/
├── __tests__/
│   ├── integration/        # Integration tests
│   │   ├── App.test.js
│   │   ├── userFlows.test.js
│   │   └── accessibility.test.js
│   └── README.md          # This file
├── Components/
│   └── __tests__/         # Component unit tests
│       ├── ErrorBoundary.test.js
│       ├── LoadingSpinner.test.js
│       ├── Toast.test.js
│       └── ConfirmDialog.test.js
└── utils/
    └── __tests__/         # Utility function tests
        ├── validation.test.js
        ├── sanitize.test.js
        └── errorHandler.test.js
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with coverage
```bash
npm test -- --coverage
```

### Run specific test file
```bash
npm test ErrorBoundary.test.js
```

### Run tests matching a pattern
```bash
npm test -- --testNamePattern="validation"
```

## Coverage Goals

We aim for the following coverage thresholds:
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

View coverage report:
```bash
npm test -- --coverage --watchAll=false
```

Coverage reports are generated in the `coverage/` directory.

## Writing Tests

### Unit Tests

Unit tests focus on testing individual components or functions in isolation.

**Example Component Test:**
```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

**Example Utility Test:**
```javascript
import { validateEmail } from './validation';

describe('validateEmail', () => {
  test('validates correct email', () => {
    const result = validateEmail('test@example.com');
    expect(result.isValid).toBe(true);
  });
});
```

### Integration Tests

Integration tests verify that multiple components work together correctly.

**Example:**
```javascript
import { renderWithProviders } from '../../utils/testUtils';
import App from '../../App';

test('user can navigate through the app', async () => {
  renderWithProviders(<App />);
  // Test navigation flow
});
```

### Accessibility Tests

Ensure components are accessible to all users.

**Example:**
```javascript
test('has proper ARIA attributes', () => {
  render(<MyComponent />);
  const element = screen.getByRole('button');
  expect(element).toHaveAttribute('aria-label', 'Action');
});
```

## Test Utilities

### Custom Render Functions

**renderWithProviders**: Renders components with all necessary providers (Router, Context)
```javascript
import { renderWithProviders } from '../utils/testUtils';

renderWithProviders(<MyComponent />, { route: '/users' });
```

**renderWithContext**: Renders components with Context only
```javascript
import { renderWithContext } from '../utils/testUtils';

renderWithContext(<MyComponent />);
```

### Mock Data

Use mock data from `src/utils/mockData.js`:
```javascript
import { mockUsers, mockTasks } from '../utils/mockData';

// Use in tests
expect(component).toContainElement(mockUsers[0].name);
```

### Common Test Patterns

#### Testing User Interactions
```javascript
import userEvent from '@testing-library/user-event';

test('handles button click', async () => {
  const user = userEvent.setup();
  render(<MyButton onClick={handleClick} />);

  await user.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalled();
});
```

#### Testing Async Operations
```javascript
import { waitFor } from '@testing-library/react';

test('loads data', async () => {
  render(<DataComponent />);

  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

#### Testing Forms
```javascript
test('validates form input', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.type(screen.getByLabelText('Email'), 'test@example.com');
  await user.type(screen.getByLabelText('Password'), 'password123');
  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

#### Testing Error Handling
```javascript
test('displays error message', async () => {
  const consoleError = jest.spyOn(console, 'error').mockImplementation();

  render(
    <ErrorBoundary>
      <ComponentThatThrows />
    </ErrorBoundary>
  );

  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

  consoleError.mockRestore();
});
```

## Mocking

### Mocking localStorage
```javascript
import { setupLocalStorageMock } from '../utils/testUtils';

beforeEach(() => {
  setupLocalStorageMock();
});
```

### Mocking API Calls
```javascript
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'mock data' })
  })
);
```

### Mocking Timers
```javascript
jest.useFakeTimers();

// Advance time
jest.advanceTimersByTime(1000);

// Clean up
jest.clearAllTimers();
```

## Best Practices

### 1. Test Behavior, Not Implementation
```javascript
// Good: Test what the user sees
expect(screen.getByText('Welcome')).toBeInTheDocument();

// Avoid: Testing internal state
expect(component.state.isLoading).toBe(false);
```

### 2. Use Semantic Queries
```javascript
// Preferred queries (in order):
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText('Email')
screen.getByPlaceholderText('Enter email')
screen.getByText('Submit')

// Avoid:
screen.getByTestId('submit-button')
```

### 3. Write Descriptive Test Names
```javascript
// Good
test('displays error message when email is invalid', () => {});

// Avoid
test('validation works', () => {});
```

### 4. Keep Tests Isolated
```javascript
// Each test should be independent
beforeEach(() => {
  // Reset state
});

afterEach(() => {
  // Clean up
});
```

### 5. Test Edge Cases
```javascript
describe('validateEmail', () => {
  test('validates correct email', () => {});
  test('rejects empty email', () => {});
  test('rejects invalid format', () => {});
  test('handles null value', () => {});
});
```

## Debugging Tests

### Run tests in debug mode
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Use screen.debug()
```javascript
import { screen } from '@testing-library/react';

test('my test', () => {
  render(<MyComponent />);
  screen.debug(); // Prints the DOM
});
```

### Log queries
```javascript
import { logRoles } from '@testing-library/react';

test('my test', () => {
  const { container } = render(<MyComponent />);
  logRoles(container); // Shows all available roles
});
```

## Continuous Integration

Tests run automatically on:
- Every commit
- Pull requests
- Before deployments

Ensure all tests pass before merging code.

## Common Issues

### Issue: Test timeout
**Solution**: Increase timeout or use `waitFor`
```javascript
jest.setTimeout(10000);

await waitFor(() => {
  expect(element).toBeInTheDocument();
}, { timeout: 5000 });
```

### Issue: "not wrapped in act()"
**Solution**: Use `waitFor` or `await` for async operations
```javascript
await waitFor(() => {
  expect(element).toBeInTheDocument();
});
```

### Issue: Query fails to find element
**Solution**: Use `screen.debug()` and check query methods
```javascript
screen.debug();
// Use findBy for async elements
const element = await screen.findByText('Async content');
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Contributing

When adding new features:
1. Write tests first (TDD approach recommended)
2. Ensure tests cover edge cases
3. Maintain or improve coverage
4. Update this documentation if adding new patterns

## Support

For questions or issues with tests:
1. Check this documentation
2. Review existing test examples
3. Consult the testing library documentation
4. Ask the team in the development channel
