import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from './Footer';
import { api } from '../../lib/api';

vi.mock('../../lib/api', () => ({
  api: {
    post: vi.fn(),
  },
}));

describe('Footer Component', () => {
  it('renders footer links and newsletter form', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByText(/About Us/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Terms & Conditions/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email address/i)).toBeInTheDocument();
  });

  it('submits newsletter successfully', async () => {
    (api.post as any).mockResolvedValueOnce({ data: { success: true } });
    
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    
    fireEvent.change(screen.getByPlaceholderText(/Email address/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Join/i }));
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/newsletter/subscribe', { email: 'test@example.com' });
      expect(screen.getByText(/Thanks for subscribing!/i)).toBeInTheDocument();
    });
  });
});
