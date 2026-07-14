import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';
import { describe, it, expect, beforeEach } from 'vitest';
import { useThemeStore } from '../../store/themeStore';

describe('ThemeToggle', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'light' });
  });

  it('renders the theme toggle button', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
  });

  it('opens the menu on click', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);
    expect(screen.getByText('Clean Light')).toBeInTheDocument();
    expect(screen.getByText('Editorial Dark')).toBeInTheDocument();
    expect(screen.getByText('Forest Calm')).toBeInTheDocument();
    expect(screen.getByText('Sunset Warm')).toBeInTheDocument();
    expect(screen.getByText('Modern Blue')).toBeInTheDocument();
  });

  it('changes theme on selection', () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: /toggle theme/i }));
    fireEvent.click(screen.getByText('Editorial Dark'));
    expect(useThemeStore.getState().theme).toBe('dark');
  });
});
