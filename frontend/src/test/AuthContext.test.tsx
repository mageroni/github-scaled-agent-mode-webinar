import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Test component to use the auth context
const TestComponent = () => {
  const { isLoggedIn, isAdmin, login, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="auth-status">{isLoggedIn ? 'authenticated' : 'not authenticated'}</div>
      <div data-testid="admin-status">{isAdmin ? 'admin' : 'not admin'}</div>
      <button data-testid="login-button" onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button data-testid="admin-login-button" onClick={() => login('admin@github.com', 'password')}>
        Admin Login
      </button>
      <button data-testid="logout-button" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  it('provides initial authentication state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const authStatus = screen.getByTestId('auth-status');
    const adminStatus = screen.getByTestId('admin-status');
    
    expect(authStatus.textContent).toBe('not authenticated');
    expect(adminStatus.textContent).toBe('not admin');
  });

  it('updates state when user logs in', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const authStatus = screen.getByTestId('auth-status');
    const adminStatus = screen.getByTestId('admin-status');
    const loginButton = screen.getByTestId('login-button');
    
    // Initial state
    expect(authStatus.textContent).toBe('not authenticated');
    expect(adminStatus.textContent).toBe('not admin');
    
    // Login with regular email
    fireEvent.click(loginButton);
    
    // Need to wait for async login
    await new Promise(resolve => setTimeout(resolve, 10));
    
    expect(authStatus.textContent).toBe('authenticated');
    expect(adminStatus.textContent).toBe('not admin');
  });

  it('sets admin status for github.com emails', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const authStatus = screen.getByTestId('auth-status');
    const adminStatus = screen.getByTestId('admin-status');
    const adminLoginButton = screen.getByTestId('admin-login-button');
    
    // Login with GitHub email
    fireEvent.click(adminLoginButton);
    
    // Need to wait for async login
    await new Promise(resolve => setTimeout(resolve, 10));
    
    expect(authStatus.textContent).toBe('authenticated');
    expect(adminStatus.textContent).toBe('admin');
  });

  it('updates state when user logs out', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const authStatus = screen.getByTestId('auth-status');
    const adminStatus = screen.getByTestId('admin-status');
    const loginButton = screen.getByTestId('login-button');
    const logoutButton = screen.getByTestId('logout-button');
    
    // Login first
    fireEvent.click(loginButton);
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(authStatus.textContent).toBe('authenticated');
    
    // Logout
    fireEvent.click(logoutButton);
    expect(authStatus.textContent).toBe('not authenticated');
    expect(adminStatus.textContent).toBe('not admin');
  });

  it('throws error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = () => {};
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow();
    
    console.error = originalError;
  });
});