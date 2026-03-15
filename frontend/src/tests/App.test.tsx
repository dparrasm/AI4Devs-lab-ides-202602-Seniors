import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders recruiter dashboard with add candidate entry point', () => {
  render(<App />);
  expect(screen.getByText(/Recruiter Dashboard/i)).toBeInTheDocument();
  expect(screen.getByText(/Add candidate/i)).toBeInTheDocument();
});
