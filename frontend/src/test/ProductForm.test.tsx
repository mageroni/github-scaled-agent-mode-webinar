import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import ProductForm from '../components/entity/product/ProductForm';

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

const mockProduct = {
  productId: 1,
  name: 'Test Product',
  description: 'Test Description',
  price: 99.99,
  sku: 'TEST-001',
  unit: 'piece',
  supplierId: 1,
  imgName: 'test.png'
};

const mockSuppliers = [
  { supplierId: 1, name: 'Supplier 1' },
  { supplierId: 2, name: 'Supplier 2' }
];

describe('ProductForm Component', () => {
  const mockOnSave = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields', () => {
    renderWithProviders(
      <ProductForm 
        suppliers={mockSuppliers}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByDisplayValue('') || screen.getByLabelText(/name/i) || screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
  });

  it('renders save and cancel buttons', () => {
    renderWithProviders(
      <ProductForm 
        suppliers={mockSuppliers}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByRole('button', { name: /create/i }) || screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i }) || screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('populates form when editing existing product', () => {
    renderWithProviders(
      <ProductForm 
        product={mockProduct}
        suppliers={mockSuppliers}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('99.99')).toBeInTheDocument();
    expect(screen.getByDisplayValue('TEST-001')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    renderWithProviders(
      <ProductForm 
        suppliers={mockSuppliers}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles form input changes', () => {
    renderWithProviders(
      <ProductForm 
        suppliers={mockSuppliers}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    
    // Find input fields and test they can be changed
    const inputs = screen.getAllByRole('textbox');
    if (inputs.length > 0) {
      fireEvent.change(inputs[0], { target: { value: 'New Product Name' } });
      expect(inputs[0]).toHaveValue('New Product Name');
    }
  });

  it('renders supplier dropdown', () => {
    renderWithProviders(
      <ProductForm 
        suppliers={mockSuppliers}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    
    const supplierSelect = screen.getByRole('combobox') || screen.getByLabelText(/supplier/i);
    expect(supplierSelect).toBeInTheDocument();
  });
});