import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ChangeLeadTimeGraph from '../src/ChangeLeadTimeGraph'

test('renders component', () => {
  render(<ChangeLeadTimeGraph  data={[]} />)
  const element = screen.getByTestId('ChangeLeadTimeGraph')
  expect(element).toBeInTheDocument()
})
