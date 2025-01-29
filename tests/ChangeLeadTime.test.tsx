import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChangeLeadTimeGraph from '../src/ChangeLeadTimeGraph';
import { changeLeadTimeName } from '../src/constants';

test('renders component', () => {
  render(<ChangeLeadTimeGraph data={[]} />);
  const element = screen.getByTestId(changeLeadTimeName);
  expect(element).toBeInTheDocument();
});
