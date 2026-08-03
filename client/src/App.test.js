import { render, screen } from '@testing-library/react';
import App from './App';

// Manual factory avoids Jest ever parsing the real axios module (its ESM
// build isn't transformed by react-scripts' default Jest config).
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
  },
}));

// StockChart pulls in react-chartjs-2, which ships ESM-only with no CJS
// export — unresolvable under react-scripts' default Jest config. Mocked
// out entirely since this is a smoke test of the app shell, not the chart.
jest.mock('./StockChart', () => () => null);

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
  );
});

test('renders the app heading', () => {
  render(<App />);
  expect(screen.getByText(/Real-Time Stock Prices/i)).toBeInTheDocument();
});
