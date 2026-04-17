import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import KPI from './KPI';

// Mock the Card component
vi.mock('./Card', () => ({
  default: ({ children, className }) => <div className={className}>{children}</div>,
}));

describe('KPI Component', () => {
  it('renders KPI with title and value', () => {
    render(
      <KPI
        title="Market Captured Traffic"
        value="2,450"
      />
    );

    expect(screen.getByText('Market Captured Traffic')).toBeInTheDocument();
    expect(screen.getByText('2,450')).toBeInTheDocument();
  });

  it('renders title with correct styling', () => {
    render(
      <KPI
        title="Test Title"
        value="100"
      />
    );

    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toHaveClass('text-neutral-400');
    expect(titleElement).toHaveClass('font-medium');
    expect(titleElement).toHaveClass('uppercase');
  });

  it('renders value with large font size', () => {
    render(
      <KPI
        title="Test"
        value="999"
      />
    );

    const valueElement = screen.getByText('999');
    expect(valueElement).toHaveClass('text-3xl');
    expect(valueElement).toHaveClass('md:text-4xl');
    expect(valueElement).toHaveClass('lg:text-5xl');
    expect(valueElement).toHaveClass('font-bold');
  });

  it('renders optional description when provided', () => {
    render(
      <KPI
        title="Test"
        value="100"
        desc="Optional description"
      />
    );

    expect(screen.getByText('Optional description')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const { container } = render(
      <KPI
        title="Test"
        value="100"
      />
    );

    // Description should not be in document
    expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
  });

  it('handles different value types (strings and numbers)', () => {
    const { rerender } = render(
      <KPI
        title="Test"
        value="1,000"
      />
    );

    expect(screen.getByText('1,000')).toBeInTheDocument();

    rerender(
      <KPI
        title="Test"
        value={1000}
      />
    );

    expect(screen.getByText('1000')).toBeInTheDocument();
  });

  it('handles formatted values like percentages', () => {
    render(
      <KPI
        title="Growth"
        value="45%"
      />
    );

    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('handles time-based values', () => {
    render(
      <KPI
        title="Peak Hour"
        value="08:00 AM"
      />
    );

    expect(screen.getByText('08:00 AM')).toBeInTheDocument();
  });

  it('has proper padding and spacing', () => {
    const { container } = render(
      <KPI
        title="Test"
        value="100"
      />
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('p-6');
    expect(wrapper).toHaveClass('md:p-8');
  });

  it('renders Card component with correct className', () => {
    const { container } = render(
      <KPI
        title="Test"
        value="100"
      />
    );

    const card = container.firstChild;
    expect(card).toHaveClass('flex');
    expect(card).toHaveClass('flex-col');
  });

  it('description has correct styling', () => {
    render(
      <KPI
        title="Test"
        value="100"
        desc="Test description"
      />
    );

    const descElement = screen.getByText('Test description');
    expect(descElement).toHaveClass('text-xs');
    expect(descElement).toHaveClass('text-neutral-500');
    expect(descElement).toHaveClass('uppercase');
    expect(descElement).toHaveClass('italic');
  });

  it('maintains proper layout structure', () => {
    const { container } = render(
      <KPI
        title="Test"
        value="100"
        desc="Description"
      />
    );

    const wrapper = container.firstChild;
    expect(wrapper.children.length).toBeGreaterThan(0);
  });
});
