import React from 'react';
import { render, screen } from '@testing-library/react';
import DeploymentFrequencyGraph from '../src/DeploymentFrequencyGraph';
import '@testing-library/jest-dom';
import { deploymentFrequencyName } from '../src/constants';

test('renders component', () => {
  render(<DeploymentFrequencyGraph data={[]} />);
  const element = screen.getByTestId(deploymentFrequencyName);
  expect(element).toBeInTheDocument();
});
