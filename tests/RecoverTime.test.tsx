import React from 'react';
import { render, screen } from '@testing-library/react';
import RecoverTimeGraph from '../src/RecoverTimeGraph';
import '@testing-library/jest-dom';
import { recoverTimeName } from '../src/constants';

test('renders component', () => {
  render(<RecoverTimeGraph data={[]} />);
  const element = screen.getByTestId(recoverTimeName);
  expect(element).toBeInTheDocument();
});
