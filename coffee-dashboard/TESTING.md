# Testing Guide for CoffeeInsight Dashboard

## Overview

This project uses **Vitest** for unit testing and **React Testing Library** for component testing. All tests follow best practices for React component testing.

## Setup

### Install Testing Dependencies

```bash
cd coffee-dashboard
npm install
```

The following testing packages are included:
- **vitest**: Fast unit test framework
- **@testing-library/react**: Component testing utilities
- **@testing-library/jest-dom**: Custom matchers for DOM assertions
- **jsdom**: JavaScript DOM implementation for testing

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Tests with UI Dashboard

```bash
npm test:ui
```

Opens an interactive dashboard at `http://localhost:51204/__vitest__/` showing:
- Test results
- Code coverage
- File tree navigation
- Live test execution

### Generate Coverage Report

```bash
npm test:coverage
```

Generates coverage reports in:
- Terminal output
- HTML report in `coverage/` directory

## Test Files

### Navigation Component Tests
**File**: `src/components/Navigation.test.jsx`

**Test Coverage**:
- ✅ **Hamburger Menu Button**
  - Toggle functionality works
  - Proper styling applied
  - Keyboard accessible
  
- ✅ **Settings Button**
  - Renders correctly
  - Calls `onPageChange("settings")`
  - Hover effects work
  
- ✅ **Language Toggle**
  - Switches between EN/TH
  - Calls `onLanguageChange`
  
- ✅ **Branch Selector**
  - Displays all options
  - Calls `onBranchChange` on selection
  
- ✅ **Breadcrumb Navigation**
  - Shows "Home" link
  - Displays current page
  - Navigates on click
  
- ✅ **Menu Items**
  - Shows all items when sidebar open
  - Highlights current page
  - Shows submenu items
  - Submenu items navigate correctly
  
- ✅ **Status Bar**
  - Shows connection status
  - Shows mode indicator
  
- ✅ **Internationalization**
  - Renders Thai content when lang="th"
  - Renders English content when lang="en"
  
- ✅ **Accessibility**
  - ARIA labels present
  - Keyboard navigation works
  - Tooltip titles provided

**Run Navigation Tests**:
```bash
npm test -- Navigation.test
```

### KPI Component Tests
**File**: `src/components/KPI.test.jsx`

**Test Coverage**:
- ✅ Renders title and value
- ✅ Title styling correct
- ✅ Value styling correct
- ✅ Optional description renders
- ✅ Description omitted when not provided
- ✅ Handles different value types
- ✅ Formats percentages
- ✅ Formats time values
- ✅ Proper padding and spacing
- ✅ Card layout structure

**Run KPI Tests**:
```bash
npm test -- KPI.test
```

## Writing New Tests

### Template for Component Tests

```javascript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders component', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });

  it('handles button click', () => {
    const mockFn = vi.fn();
    render(<MyComponent onClick={mockFn} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockFn).toHaveBeenCalled();
  });
});
```

### Best Practices

1. **Use semantic queries**: Prefer `getByRole`, `getByLabelText`, `getByText`
2. **Test user behavior**: Not implementation details
3. **Use `fireEvent` for interactions**: Clicks, typing, selection changes
4. **Mock external dependencies**: Use `vi.fn()` and `vi.mock()`
5. **Test accessibility**: Check ARIA attributes and keyboard navigation
6. **Group related tests**: Use `describe` blocks
7. **Use descriptive test names**: Clearly state what is being tested

## Test Structure

```
src/
├── components/
│   ├── Navigation.jsx
│   ├── Navigation.test.jsx        # Component tests
│   ├── KPI.jsx
│   ├── KPI.test.jsx
│   └── ...
├── test/
│   └── setup.js                   # Test configuration
└── pages/
    └── ...
```

## Debugging Tests

### Run Single Test File

```bash
npm test -- Navigation.test
```

### Run Single Test Case

```bash
npm test -- Navigation.test -t "hamburger button"
```

### Debug in Browser

Add `debugger` statement in test:
```javascript
it('test case', () => {
  render(<Component />);
  debugger; // Pauses execution
  // ... rest of test
});
```

Then run with:
```bash
node --inspect-brk ./node_modules/vitest/vitest.mjs
```

## Assertions

### Common Testing Library Assertions

```javascript
// Check if element exists
expect(screen.getByText('text')).toBeInTheDocument();

// Check if element is visible
expect(element).toBeVisible();

// Check if button is disabled
expect(button).toBeDisabled();

// Check if element has class
expect(element).toHaveClass('className');

// Check if element has attribute
expect(element).toHaveAttribute('title', 'value');

// Check if function was called
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');

// Check element content
expect(element.textContent).toBe('expected text');

// Check element value
expect(input).toHaveValue('input value');
```

## Fixing Failed Tests

### Issue: "act" Warning

**Problem**: Warning about state updates not wrapped in act()

**Solution**: Tests using `fireEvent` should have `waitFor` for state updates:
```javascript
import { waitFor } from '@testing-library/react';

it('updates state', async () => {
  render(<Component />);
  fireEvent.click(button);
  
  await waitFor(() => {
    expect(screen.getByText('updated')).toBeInTheDocument();
  });
});
```

### Issue: Element Not Found

**Problem**: `screen.getByRole('button')` returns multiple elements

**Solution**: Use more specific queries or `getAllByRole`:
```javascript
// Specific query
const button = screen.getByRole('button', { name: /submit/i });

// Get all and filter
const buttons = screen.getAllByRole('button');
const submitBtn = buttons.find(btn => btn.textContent.includes('Submit'));
```

### Issue: Mock Not Working

**Problem**: Component using imported module directly

**Solution**: Mock at top level before component import:
```javascript
vi.mock('./Card', () => ({
  default: MockCard,
}));

import Navigation from './Navigation';
```

## Continuous Integration

Tests should run in CI/CD pipeline:

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm test -- --run

- name: Generate coverage
  run: npm test:coverage
```

## Coverage Goals

Target coverage percentages:
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

View coverage report:
```bash
npm test:coverage
open coverage/index.html
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Troubleshooting

### Tests Won't Run
```bash
# Clear cache
rm -rf node_modules/.vitest

# Reinstall
npm install

# Try again
npm test
```

### Import Errors
```bash
# Check ES modules configuration
# Ensure package.json has: "type": "module"

# Check vite.config.js and vitest.config.js
```

### Component Not Rendering
```javascript
// Make sure to wrap async operations
import { waitFor } from '@testing-library/react';

it('renders data', async () => {
  render(<Component />);
  
  await waitFor(() => {
    expect(screen.getByText('data')).toBeInTheDocument();
  });
});
```

---

**Happy Testing!** 🧪✨
