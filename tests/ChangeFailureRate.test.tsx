import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChangeFailureRateGraph from '../src/ChangeFailureRateGraph';
import { changeFailureRateName } from '../src/constants';

test('renders component', () => {
  render(<ChangeFailureRateGraph data={[]} />);
  const element = screen.getByTestId(changeFailureRateName);
  expect(element).toBeInTheDocument();
});
