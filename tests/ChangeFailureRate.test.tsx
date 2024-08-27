import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChangeFailureRateGraph from '../src/ChangeFailureRateGraph';

test('renders component', () => {
  render(<ChangeFailureRateGraph data={[]} />);
  const element = screen.getByTestId('ChangeFailureRateGraph');
  expect(element).toBeInTheDocument();
});
