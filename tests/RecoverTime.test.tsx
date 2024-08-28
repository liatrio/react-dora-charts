import React from 'react';
import { render, screen } from '@testing-library/react';
import RecoverTimeGraph from '../src/RecoverTimeGraph';
import '@testing-library/jest-dom';

test('renders component', () => {
  render(<RecoverTimeGraph data={[]} />);
  const element = screen.getByTestId('RecoverTimeGraph');
  expect(element).toBeInTheDocument();
});
