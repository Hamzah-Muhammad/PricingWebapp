# Real-Time Stock Price Simulator

A full-stack web application that simulates and visualizes real-time stock price movements, built with a **Node.js/Express** backend and a **React** frontend. Prices are generated using **Geometric Brownian Motion (GBM)**, a stochastic model widely used in quantitative finance to predict future asset prices.

## Overview

This app lets a user select a stock ticker and watch its price evolve in real time on an interactive chart. Behind the scenes, a Node.js server models each stock as a stochastic process and streams new prices to the client every minute. Users can also tune each stock's **drift** (expected return) and **volatility** parameters live and immediately see the effect on the simulated price path.

## Features

- **Real-time price streaming** — the client polls the backend every minute for a new simulated price tick, appended to a live line chart (Chart.js).
- **Stochastic price modeling with GBM** — prices evolve according to the closed-form Geometric Brownian Motion solution:

  ```
  S(t+dt) = S(t) * exp[(μ - 0.5σ²)dt + σ√dt * Z]
  ```

  where `μ` is drift, `σ` is volatility, `dt` is the time step, and `Z` is a random shock.
- **Market-hours awareness** — the backend checks the current time against standard market hours (9:30 AM–4:00 PM) and replays the prior day's price history outside of trading hours, rather than generating misleading live ticks.
- **Adjustable model parameters** — a control panel lets users edit a ticker's drift and volatility and re-run the simulation with the new inputs, useful for exploring how each parameter affects price behavior.
- **Ticker search** — a searchable dropdown, populated dynamically from the backend, lists all available tickers.

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 18, Chart.js / react-chartjs-2, Axios |
| Backend    | Node.js, Express |
| Data       | Static JSON seed data (`InitialData.json`) with in-memory simulation state |

## Architecture

```
PricingWebapp/
├── client/          # React single-page app
│   └── src/
│       ├── App.js          # Top-level state, polling, and layout
│       ├── SearchBar.js    # Ticker selector, fetches /api/tickers
│       ├── StockChart.js   # Chart.js line chart of price history
│       └── Parameters.js   # Form to edit drift/volatility
└── server/          # Express API
    ├── server.js           # REST endpoints + GBM simulation logic
    └── InitialData.json    # Seed prices, drift, and volatility per ticker
```

The frontend and backend are independent Node projects (no monorepo tooling) and communicate over a REST API.

## API Endpoints

| Method | Endpoint                                    | Description                                      |
|--------|----------------------------------------------|---------------------------------------------------|
| GET    | `/api/tickers`                              | List all available stock tickers                  |
| GET    | `/api/stock/:ticker`                        | Get the current price history for a ticker, generating a new tick if the market is open |
| GET    | `/api/stock/:ticker/initial-parameters`     | Get the current drift and volatility for a ticker |
| POST   | `/api/stock/:ticker/parameters`             | Update the drift and volatility used in the simulation |

## Getting Started

### Prerequisites
- Node.js and npm installed

### Installation & Running Locally

**1. Start the backend**
```bash
cd server
npm install
node server.js
```
The API will run at `http://localhost:5001`.

**2. Start the frontend** (in a separate terminal)
```bash
cd client
npm install
npm start
```
The app will open at `http://localhost:3001`.

### Adding or Editing Stock Data
Seed values (starting price, drift, volatility) live in `server/InitialData.json`. Add a new ticker entry there and restart the server to make it available in the app.

## Possible Improvements

- Persist simulation state and parameters to a database instead of in-memory objects
- Replace simulated prices with a real market-data feed (e.g., a live quotes API)
- WebSocket-based streaming instead of client-side polling
- Deploy a hosted live demo

## Author

Built by [Hamzah Muhammad](https://github.com/Hamzah-Muhammad).
