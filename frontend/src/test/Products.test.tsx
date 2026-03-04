import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import Products from '../components/entity/product/Products';
import * as api from '../api/api';

// Mock the API
vi.mock('../api/api', () => ({
  getProducts: vi.fn(),
}));

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

const mockProducts = [
  {
    productId: 1,
    name: 'SmartLitter Pro 3000',
    description: 'Advanced smart litter box',
    price: 199.99,
    sku: 'CAT-LITTER-001',
    unit: 'piece',
    imgName: 'litter-box.png'
  },
  {
    productId: 2,
    name: 'CatFlix Entertainment Portal',
    description: 'Entertainment system for cats',
    price: 89.99,
    sku: 'CAT-FLIX-001',
    unit: 'piece',
    imgName: 'catflix.png'
  }
];

describe('Products Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders products when data is loaded', async () => {
    (api.getProducts as any).mockResolvedValue(mockProducts);
    
    renderWithProviders(<Products />);
    
    await waitFor(() => {
      expect(screen.getByText('SmartLitter Pro 3000')).toBeInTheDocument();
      expect(screen.getByText('CatFlix Entertainment Portal')).toBeInTheDocument();
    });
  });

  it('displays loading state initially', () => {
    (api.getProducts as any).mockImplementation(() => new Promise(() => {})); // Never resolves
    
    renderWithProviders(<Products />);
    
    expect(screen.getByText(/loading/i) || screen.getByRole('progressbar')).toBeTruthy();
  });

  it('handles API error gracefully', async () => {
    (api.getProducts as any).mockRejectedValue(new Error('API Error'));
    
    renderWithProviders(<Products />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i) || screen.getByText(/failed/i)).toBeTruthy();
    });
  });

  it('displays product information correctly', async () => {
    (api.getProducts as any).mockResolvedValue(mockProducts);
    
    renderWithProviders(<Products />);
    
    await waitFor(() => {
      // Check for product names
      expect(screen.getByText('SmartLitter Pro 3000')).toBeInTheDocument();
      
      // Check for prices
      expect(screen.getByText(/199\.99/)).toBeInTheDocument();
      expect(screen.getByText(/89\.99/)).toBeInTheDocument();
    });
  });

  it('renders product grid layout', async () => {
    (api.getProducts as any).mockResolvedValue(mockProducts);
    
    renderWithProviders(<Products />);
    
    await waitFor(() => {
      // Should have a grid or list container
      const productContainer = screen.getByTestId('products-grid') || 
                              screen.getByRole('list') ||
                              document.querySelector('.grid, .products-grid, .product-list');
      
      expect(productContainer).toBeTruthy();
    });
  });
});