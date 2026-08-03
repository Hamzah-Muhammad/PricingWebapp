import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import SearchBar from "./SearchBar";
import StockChart from "./StockChart";
import Parameters from "./Parameters";
import { API_BASE_URL } from "./config";


function App() {
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [drift, setDrift] = useState(null);
  const [volatility, setVolatility] = useState(null);
  const [error, setError] = useState(null);

  // Fetch stock data when the selected ticker changes
  useEffect(() => {
    let intervalId;

    const fetchInitialData = async () => {
      try {
        // First get the initial parameters
        const paramsResponse = await axios.get(
          `${API_BASE_URL}/api/stock/${selectedTicker}/initial-parameters`
        );
        setDrift(paramsResponse.data.drift);
        setVolatility(paramsResponse.data.volatility);

        // Then get the stock data
        const stockResponse = await axios.get(
          `${API_BASE_URL}/api/stock/${selectedTicker}`
        );
        setStockData(stockResponse.data.prices);
        setError(null);
      } catch (err) {
        setError("Failed to fetch stock data. Please check the backend server.");
        console.error(err);
      }
    };

    if (selectedTicker) {
      fetchInitialData();
      intervalId = setInterval(fetchInitialData, 60000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [selectedTicker]);

  const handleParameterUpdate = async (newDrift, newVolatility) => {
    try {
      // Log the updated parameters
      console.log("Updating parameters:", {
        drift: newDrift,
        volatility: newVolatility,
      });
  
      // Send the updated parameters to the backend
      const response = await axios.post(`${API_BASE_URL}/api/stock/${selectedTicker}/parameters`, {
        drift: newDrift,
        volatility: newVolatility,
      });
  
      // Log the backend response in the console
      console.log("Backend response:", response.data);
  
      // Update with the new parameters
      setDrift(newDrift);
      setVolatility(newVolatility);
  
      // Send a success message 
      console.log("Parameters updated successfully!");
    } catch (err) {
      setError("Failed to update parameters. Please check the backend server.");
      console.error("Error updating parameters:", err);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="app-brand">
          <h1>Real-Time Stock Prices</h1>
          <p className="app-tagline">GBM simulator by Hamzah Muhammad</p>
        </div>
        <span className="app-demo-badge">Demo · Simulated Data</span>
      </header>

      <main className="app-body">
        <div className="hero-copy">
          <h2>Select a ticker to get started</h2>
          <p>Prices are simulated tick-by-tick using Geometric Brownian Motion — tune the drift and volatility below to see how the path changes.</p>
        </div>

        <div className="ticker-search">
          <SearchBar onSelectTicker={setSelectedTicker} />
        </div>

        {error && <div className="error-banner">{error}</div>}

        {selectedTicker && (
          <>
            <div className="stock-chart-container">
              <StockChart data={stockData} ticker={selectedTicker} />
            </div>
            <div className="parameters-section">
              <Parameters
                drift={drift}
                volatility={volatility}
                onUpdate={handleParameterUpdate}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;