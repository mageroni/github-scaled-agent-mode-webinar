import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

// Test component to use the theme context
const TestComponent = () => {
  const { darkMode, toggleTheme } = useTheme();
  
  return (
    <div>
      <div data-testid="theme-status">{darkMode ? 'dark' : 'light'}</div>
      <button data-testid="toggle-button" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};

describe('ThemeContext', () => {
  it('provides initial theme state', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    const themeStatus = screen.getByTestId('theme-status');
    expect(themeStatus.textContent).toBe('light'); // Default should be light mode
  });

  it('toggles theme when toggleTheme is called', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    const themeStatus = screen.getByTestId('theme-status');
    const toggleButton = screen.getByTestId('toggle-button');
    
    // Initial state should be light
    expect(themeStatus.textContent).toBe('light');
    
    // Toggle to dark
    fireEvent.click(toggleButton);
    expect(themeStatus.textContent).toBe('dark');
    
    // Toggle back to light
    fireEvent.click(toggleButton);
    expect(themeStatus.textContent).toBe('light');
  });

  it('throws error when useTheme is used outside ThemeProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = () => {};
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow();
    
    console.error = originalError;
  });
});