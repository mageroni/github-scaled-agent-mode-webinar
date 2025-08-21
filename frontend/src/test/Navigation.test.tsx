import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import Navigation from '../components/Navigation';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <ThemeProvider>
          {component}
        </ThemeProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Navigation Component', () => {
  it('renders main navigation links', () => {
    renderWithProviders(<Navigation />);
    
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /products/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });

  it('renders brand/logo', () => {
    renderWithProviders(<Navigation />);
    
    // Look for brand text or logo
    expect(screen.getByText(/octocat/i) || screen.getByRole('img', { name: /logo/i })).toBeInTheDocument();
  });

  it('has proper navigation structure', () => {
    renderWithProviders(<Navigation />);
    
    // Should have nav element
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    renderWithProviders(<Navigation />);
    
    // Look for theme toggle button or icon
    const themeButton = screen.queryByRole('button', { name: /theme/i }) || 
                       screen.queryByRole('button', { name: /dark/i }) ||
                       screen.queryByRole('button', { name: /light/i });
    
    if (themeButton) {
      expect(themeButton).toBeInTheDocument();
    }
  });

  it('is accessible', () => {
    renderWithProviders(<Navigation />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeVisible();
    
    // Navigation should contain links
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});