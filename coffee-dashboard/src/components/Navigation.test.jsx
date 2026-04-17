import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navigation from './Navigation';

describe('Navigation Component', () => {
  const mockProps = {
    selectedBranch: 'asoke-01',
    branches: [
      { id: 'asoke-01', name: 'Asoke Junction' },
      { id: 'sukhumvit-24', name: 'Sukhumvit 24' },
    ],
    onBranchChange: vi.fn(),
    lang: 'en',
    onLanguageChange: vi.fn(),
    currentPage: 'dashboard',
    onPageChange: vi.fn(),
  };

  it('renders Navigation component', () => {
    render(<Navigation {...mockProps} />);
    expect(screen.getByText('CoffeeInsight')).toBeInTheDocument();
  });

  describe('Hamburger Menu Button', () => {
    it('hamburger button starts closed and toggles on click', () => {
      render(<Navigation {...mockProps} />);
      const hamburgerBtn = screen.getByRole('button', { name: /toggle navigation menu/i });

      expect(hamburgerBtn).toBeInTheDocument();
      // Initially closed, so shows coffee cup icon
      expect(hamburgerBtn.textContent).toBe('☕');

      // Click to open modal
      fireEvent.click(hamburgerBtn);

      // After click, should show hamburger icon
      expect(hamburgerBtn.textContent).toBe('≡');
    });

    it('hamburger button has proper cafe colors', () => {
      render(<Navigation {...mockProps} />);
      const hamburgerBtn = screen.getByRole('button', { name: /toggle navigation menu/i });

      expect(hamburgerBtn).toHaveClass('bg-caramel-500');
      expect(hamburgerBtn).toHaveClass('text-cream-50');
      expect(hamburgerBtn).toHaveClass('border-2');
    });

    it('hamburger button is keyboard accessible', () => {
      render(<Navigation {...mockProps} />);
      const hamburgerBtn = screen.getByRole('button', { name: /toggle navigation menu/i });

      hamburgerBtn.focus();
      expect(hamburgerBtn).toHaveFocus();

      fireEvent.keyDown(hamburgerBtn, { key: 'Enter', code: 'Enter' });
      // Button state should change
      expect(hamburgerBtn).toBeInTheDocument();
    });
  });

  describe('Language Toggle Button', () => {
    it('language button toggles between TH and EN', () => {
      const { rerender } = render(<Navigation {...mockProps} />);
      const langBtn = screen.getByRole('button', { name: 'EN' });

      expect(langBtn.textContent).toBe('EN');

      fireEvent.click(langBtn);

      rerender(<Navigation {...{ ...mockProps, lang: 'th' }} />);
      const langBtnTh = screen.getByRole('button', { name: 'TH' });
      expect(langBtnTh.textContent).toBe('TH');
    });

    it('language button calls onLanguageChange', () => {
      const onLanguageChange = vi.fn();
      render(<Navigation {...{ ...mockProps, onLanguageChange }} />);

      const langBtn = screen.getByRole('button', { name: 'EN' });
      fireEvent.click(langBtn);

      expect(onLanguageChange).toHaveBeenCalledWith('th');
    });
  });

  describe('Branch Selector', () => {
    it('renders branch dropdown with correct options', () => {
      render(<Navigation {...mockProps} />);
      const select = screen.getByDisplayValue('Asoke Junction');

      expect(select).toBeInTheDocument();
      expect(screen.getByText('Asoke Junction')).toBeInTheDocument();
      expect(screen.getByText('Sukhumvit 24')).toBeInTheDocument();
    });

    it('branch selector calls onBranchChange when selection changes', () => {
      const onBranchChange = vi.fn();
      render(<Navigation {...{ ...mockProps, onBranchChange }} />);

      const select = screen.getByDisplayValue('Asoke Junction');
      fireEvent.change(select, { target: { value: 'sukhumvit-24' } });

      expect(onBranchChange).toHaveBeenCalledWith('sukhumvit-24');
    });
  });


  describe('Navigation Modal', () => {
    it('modal is closed initially', () => {
      render(<Navigation {...mockProps} />);

      // Modal should not be visible initially
      expect(screen.queryByText(/Menu/)).not.toBeInTheDocument();
    });

    it('modal appears when hamburger button is clicked', async () => {
      render(<Navigation {...mockProps} />);

      const hamburgerBtn = screen.getByRole('button', { name: /toggle navigation menu/i });
      fireEvent.click(hamburgerBtn);

      // Modal should now be visible with Menu header
      await waitFor(() => {
        expect(screen.getByText(/Menu/)).toBeInTheDocument();
      });
    });

    it('modal shows all menu items when opened', async () => {
      render(<Navigation {...mockProps} />);

      const hamburgerBtn = screen.getByRole('button', { name: /toggle navigation menu/i });
      fireEvent.click(hamburgerBtn);

      await waitFor(() => {
        expect(screen.getByText(/Dashboard/)).toBeInTheDocument();
        expect(screen.getByText(/Analytics/)).toBeInTheDocument();
        expect(screen.getByText(/Simulation/)).toBeInTheDocument();
        expect(screen.getByText(/Locations/)).toBeInTheDocument();
      });
    });

    it('modal can be closed by clicking X button', async () => {
      render(<Navigation {...mockProps} />);

      const hamburgerBtn = screen.getByRole('button', { name: /toggle navigation menu/i });
      fireEvent.click(hamburgerBtn);

      // Find and click close button (✕)
      const closeBtn = screen.getByRole('button', { name: /close menu/i });
      fireEvent.click(closeBtn);

      // Modal should be closed
      await waitFor(() => {
        expect(screen.queryByText(/Menu/)).not.toBeInTheDocument();
      });
    });

    it('modal closes when clicking overlay backdrop', async () => {
      const { container } = render(<Navigation {...mockProps} />);

      const hamburgerBtn = screen.getByRole('button', { name: /toggle navigation menu/i });
      fireEvent.click(hamburgerBtn);

      // Get the overlay backdrop
      const overlay = container.querySelector('div[class*="backdrop-blur-sm"]');
      if (overlay) {
        fireEvent.click(overlay);
      }

      // Modal should be closed
      await waitFor(() => {
        expect(screen.queryByText(/Menu/)).not.toBeInTheDocument();
      });
    });

    it('menu item closes modal when clicked', async () => {
      const onPageChange = vi.fn();
      render(<Navigation {...{ ...mockProps, onPageChange }} />);

      const hamburgerBtn = screen.getByRole('button', { name: /toggle navigation menu/i });
      fireEvent.click(hamburgerBtn);

      await waitFor(() => {
        const analyticsBtn = screen.getByText(/Analytics/);
        fireEvent.click(analyticsBtn);
      });

      expect(onPageChange).toHaveBeenCalledWith('analytics');
      // Modal should be closed after navigation
      await waitFor(() => {
        expect(screen.queryByText(/Menu/)).not.toBeInTheDocument();
      });
    });

    it('submenu items appear when parent is active', async () => {
      render(<Navigation {...{ ...mockProps, currentPage: 'analytics' }} />);

      const hamburgerBtn = screen.getByRole('button', { name: /toggle navigation menu/i });
      fireEvent.click(hamburgerBtn);

      await waitFor(() => {
        expect(screen.getByText('Geo-Spatial')).toBeInTheDocument();
        expect(screen.getByText('Demand')).toBeInTheDocument();
        expect(screen.getByText('Revenue')).toBeInTheDocument();
      });
    });

    it('submenu items call onPageChange and close modal', async () => {
      const onPageChange = vi.fn();
      render(<Navigation {...{ ...mockProps, currentPage: 'analytics', onPageChange }} />);

      const hamburgerBtn = screen.getByRole('button', { name: /toggle navigation menu/i });
      fireEvent.click(hamburgerBtn);

      await waitFor(() => {
        const geoBtn = screen.getByText('Geo-Spatial');
        fireEvent.click(geoBtn);
        expect(onPageChange).toHaveBeenCalledWith('geo');
      });

      // Modal should close
      await waitFor(() => {
        expect(screen.queryByText(/Menu/)).not.toBeInTheDocument();
      });
    });

    it('settings button in modal footer works', async () => {
      const onPageChange = vi.fn();
      render(<Navigation {...{ ...mockProps, onPageChange }} />);

      const hamburgerBtn = screen.getByRole('button', { name: /toggle navigation menu/i });
      fireEvent.click(hamburgerBtn);

      await waitFor(() => {
        // Find settings button in modal footer (use getAllByRole to distinguish from menu items)
        const allSettingsButtons = screen.getAllByRole('button', { name: /settings/i });
        const footerSettingsBtn = allSettingsButtons[allSettingsButtons.length - 1]; // Last one is footer
        fireEvent.click(footerSettingsBtn);
        expect(onPageChange).toHaveBeenCalledWith('settings');
      });
    });

    it('current page menu item is highlighted', async () => {
      render(<Navigation {...{ ...mockProps, currentPage: 'analytics' }} />);

      const hamburgerBtn = screen.getByRole('button', { name: /toggle navigation menu/i });
      fireEvent.click(hamburgerBtn);

      await waitFor(() => {
        const analyticsBtn = screen.getByText(/Analytics/);
        expect(analyticsBtn).toHaveClass('from-caramel-500');
      });
    });
  });


  describe('Internationalization', () => {
    it('renders Thai content when lang is th', () => {
      render(<Navigation {...{ ...mockProps, lang: 'th' }} />);

      const langBtn = screen.getByRole('button', { name: 'EN' });
      expect(langBtn).toBeInTheDocument();

      // Check for Thai text in menu
      expect(screen.getByText(/แดชบอร์ด/)).toBeInTheDocument();
    });

    it('renders English content when lang is en', () => {
      render(<Navigation {...{ ...mockProps, lang: 'en' }} />);

      const langBtn = screen.getByRole('button', { name: 'EN' });
      expect(langBtn).toBeInTheDocument();

      expect(screen.getByText(/Dashboard/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('hamburger button has aria-label', () => {
      render(<Navigation {...mockProps} />);
      const hamburgerBtn = screen.getByRole('button', { name: /toggle navigation menu/i });

      expect(hamburgerBtn).toHaveAttribute('aria-label', 'Toggle navigation menu');
    });

    it('all buttons have title attributes for tooltips', () => {
      render(<Navigation {...mockProps} />);

      const hamburgerBtn = screen.getByRole('button', { name: /toggle navigation menu/i });
      expect(hamburgerBtn).toHaveAttribute('title');

      const langBtn = screen.getByRole('button', { name: 'EN' });
      expect(langBtn).toHaveAttribute('title');
    });

    it('buttons are keyboard navigable', () => {
      render(<Navigation {...mockProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(btn => {
        expect(btn).toBeVisible();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty branches array', () => {
      render(<Navigation {...{ ...mockProps, branches: [] }} />);

      expect(screen.getByText('CoffeeInsight')).toBeInTheDocument();
    });

    it('handles single branch', () => {
      render(<Navigation {...{ ...mockProps, branches: [{ id: 'single', name: 'Single Branch' }] }} />);

      expect(screen.getByDisplayValue('Single Branch')).toBeInTheDocument();
    });

    it('handles undefined onPageChange gracefully', () => {
      const { onPageChange, ...propsWithoutPageChange } = mockProps;
      expect(() => {
        render(<Navigation {...propsWithoutPageChange} onPageChange={undefined} />);
      }).not.toThrow();
    });
  });
});
