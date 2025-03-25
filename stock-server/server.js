const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Read the JSON file
const fs = require('fs');
let stocks = {};

try {
  // Read the JSON file with the Inital Data given
  const data = fs.readFileSync('InitialData.json', 'utf8');
  stocks = JSON.parse(data);

  // Add a currentPrice array 
  for (const ticker in stocks) {
    if (stocks[ticker]) {
      // Set currentPrice equal to open
      stocks[ticker].currentPrice = stocks[ticker].open;

      // Add a history array 
      if (!stocks[ticker].history) {
        stocks[ticker].history = [];
      }
    }
  }
  // Console log of Initial Data
  console.log('Stocks data loaded and updated:', stocks);   
} catch (err) {
  console.error('Error reading or parsing InitialData.json:', err);
}

// Function to calculate the next price using GBM
const getNextPrice = (currentPrice, drift, volatility, dt) => {
  const random = Math.random() * 2 - 1; // Random value between -1 and 1
  return currentPrice * Math.exp((drift - 0.5 * volatility ** 2) * dt + volatility * Math.sqrt(dt) * random);
};

// Function to generate prices for a given day
const generatePricesForDay = (stock, startTime, endTime) => {
  const prices = [];
  let currentPrice = stock.open;
  for (let time = startTime; time <= endTime; time.setMinutes(time.getMinutes() + 1)) {
    const dt = 1; // Time step is 1 minute
    currentPrice = getNextPrice(currentPrice, stock.drift, stock.volatility, dt); // Calculate the next price
    prices.push({
      time: time.toLocaleTimeString(),
      price: currentPrice,
    });
  }
  return { prices, currentPrice };
};

// GET API to fetch stock data
app.get("/api/stock/:ticker", (req, res) => {
  const ticker = req.params.ticker;
  const stock = stocks[ticker];
  if (!stock) return res.status(404).send("Stock not found");

  const now = new Date();
  const startTimeToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30); // Today at 9:30 AM
  const endTimeToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0); // Today at 4:00 PM

  // Check if the current time is outside trading hours
  if (now < startTimeToday || now > endTimeToday) {
    // If outside trading hours, return the history for the previous trading day
    if (stock.history.length === 0) {
      const previousDay = new Date(now);
      previousDay.setDate(now.getDate() - 1); // Set to previous day
      const startTimeYesterday = new Date(previousDay.getFullYear(), previousDay.getMonth(), previousDay.getDate(), 9, 30); // Yesterday at 9:30 AM
      const endTimeYesterday = new Date(previousDay.getFullYear(), previousDay.getMonth(), previousDay.getDate(), 16, 0); // Yesterday at 4:00 PM

      const { prices, currentPrice } = generatePricesForDay(stock, startTimeYesterday, endTimeYesterday);
      stock.history = prices;
      stock.currentPrice = currentPrice;
    }

    res.json({ prices: stock.history });
  } else {
    // If within trading hours, generate prices from market open to the current time
    if (stock.history.length === 0) {
      const { prices, currentPrice } = generatePricesForDay(stock, startTimeToday, now);
      stock.history = prices;
      stock.currentPrice = currentPrice;
    } else {
      // Generate new prices for the current minute
      const dt = 1; // Time step is 1 minute
      const newPrice = getNextPrice(stock.currentPrice, stock.drift, stock.volatility, dt);

      // Update the current price and history
      stock.currentPrice = newPrice;
      stock.history.push({
        time: now.toLocaleTimeString(),
        price: newPrice,
      });
    }

    console.log(`New price generated for ${ticker}:`, stock.currentPrice); // Log the new price in the console
    res.json({ prices: stock.history }); // Return the full history stock history
  }
});

// GET API to return the list of tickers
app.get("/api/tickers", (req, res) => {
  const tickers = Object.keys(stocks);
  console.log('Tickers:', tickers); 
  res.json(tickers); // Send the tickers array as a JSON response 
});

// POST API to update parameters
app.post("/api/stock/:ticker/parameters", (req, res) => {
  const ticker = req.params.ticker;
  const { drift, volatility } = req.body;

  if (!stocks[ticker]) return res.status(404).send("Stock not found");

  // Log the received parameters
  console.log(`Updating parameters for ${ticker}:`, { drift, volatility });

  // Update parameters with the new parameters inputted
  stocks[ticker].drift = drift;
  stocks[ticker].volatility = volatility;

  // Return a success response if parameters are updated successfully 
  res.json({ message: "Parameters updated successfully" });
});

// Start the server
app.listen(5001, () => {
  console.log("Server running on http://localhost:5001");
});