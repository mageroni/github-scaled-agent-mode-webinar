import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import Welcome from '../components/Welcome';

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

describe('Welcome Component', () => {
  it('renders welcome heading', () => {
    renderWithProviders(<Welcome />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithProviders(<Welcome />);
    expect(screen.getByRole('link', { name: /products/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });

  it('renders product carousel section', () => {
    renderWithProviders(<Welcome />);
    // Check for carousel or featured products section
    expect(screen.getByText(/featured products/i) || screen.getByText(/products/i)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    renderWithProviders(<Welcome />);
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeVisible();
  });
});