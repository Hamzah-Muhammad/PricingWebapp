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
  // Read the JSON file
  const data = fs.readFileSync('InitialData.json', 'utf8');
  stocks = JSON.parse(data);

  // Iterate through each stock and add/update properties
  for (const ticker in stocks) {
    if (stocks[ticker]) {
      // Set currentPrice equal to open
      stocks[ticker].currentPrice = stocks[ticker].open;

      // Initialize history as an empty array if it doesn't exist
      if (!stocks[ticker].history) {
        stocks[ticker].history = [];
      }
    }
  }

  console.log('Stocks data loaded and updated:', stocks); // Debugging: Log the updated data
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

app.get("/api/stock/:ticker", (req, res) => {
  const ticker = req.params.ticker;
  const stock = stocks[ticker];
  if (!stock) return res.status(404).send("Stock not found");

  const now = new Date();
  const startTimeToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0); // Today at 9:30 AM
  const endTimeToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0); // Today at 4:00 PM

  // Check if the current time is outside trading hours
  if (now < startTimeToday || now > endTimeToday) {
    // If outside trading hours, generate prices for the previous trading day
    const previousDay = new Date(now);
    previousDay.setDate(now.getDate() - 1); // Set to previous day
    const startTimeYesterday = new Date(previousDay.getFullYear(), previousDay.getMonth(), previousDay.getDate(), 9, 30); // Yesterday at 9:30 AM
    const endTimeYesterday = new Date(previousDay.getFullYear(), previousDay.getMonth(), previousDay.getDate(), 16, 0); // Yesterday at 4:00 PM

    // If history is empty, generate the full price history for the previous day
    if (stock.history.length === 0) {
      const { prices, currentPrice } = generatePricesForDay(stock, startTimeYesterday, endTimeYesterday);
      stock.history = prices;
      stock.currentPrice = currentPrice;
    }

    res.json({ prices: stock.history });
  } else {
    // If within trading hours, generate prices for the current day
    if (stock.history.length === 0) {
      const { prices, currentPrice } = generatePricesForDay(stock, startTimeToday, now);
      stock.history = prices;
      stock.currentPrice = currentPrice;
    }

    res.json({ prices: stock.history });
  }
});



// GET API to return the list of tickers
app.get("/api/tickers", (req, res) => {
  const tickers = Object.keys(stocks);
  console.log('Tickers:', tickers); // Log the tickers array
  res.json(tickers); // Send the tickers array as a JSON response
});

app.post("/api/stock/:ticker/parameters", (req, res) => {
  const ticker = req.params.ticker;
  const { drift, volatility } = req.body;

  if (!stocks[ticker]) return res.status(404).send("Stock not found");

  // Update the parameters
  stocks[ticker].drift = drift;
  stocks[ticker].volatility = volatility;

  // Calculate the next price using the updated parameters
  const dt = 1; // Time step is 1 minute
  const nextPrice = getNextPrice(stocks[ticker].currentPrice, drift, volatility, dt);

  // Update the current price for the stock
  stocks[ticker].currentPrice = nextPrice;

  // Add the new price to the history
  const newTime = new Date().toLocaleTimeString(); // Use the current time for the new data point
  stocks[ticker].history.push({
    time: newTime,
    price: nextPrice,
  });

  // Return the new price
  res.json({ price: nextPrice });
});

app.listen(5001, () => {
  console.log("Server running on http://localhost:5001");
});