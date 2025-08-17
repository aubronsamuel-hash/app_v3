import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../Button';
import { test, expect } from 'vitest';

test('renders primary variant', () => {
  const { getByRole } = render(<Button>Ok</Button>);
  expect(getByRole('button')).toHaveClass('bg-blue-600');
});

test('renders outline variant', () => {
  const { getByRole } = render(<Button variant="outline">Ok</Button>);
  expect(getByRole('button')).toHaveClass('border-blue-600');
});
