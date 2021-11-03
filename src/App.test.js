import { render, screen } from '@testing-library/react';
import App from './App';
const keccak256 = require('keccak256');

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/call me/i);
  expect(linkElement).toBeInTheDocument();
});
