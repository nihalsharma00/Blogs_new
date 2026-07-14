import { render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../store/authStore', () => ({
  useAuthStore: () => ({
    user: null,
    logout: vi.fn(),
  }),
}));

describe('Navbar', () => {
  it('renders the branding and navigation links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText('VlogPlatform')).toBeInTheDocument();
    expect(screen.getAllByText('Categories').length).toBeGreaterThan(0);
    expect(screen.getAllByText('About').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Login').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Sign Up').length).toBeGreaterThan(0);
  });
});
