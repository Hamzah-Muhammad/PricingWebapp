import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import SearchBar from "./SearchBar";
import StockChart from "./StockChart";
import Parameters from "./Parameters";


function App() {
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [drift, setDrift] = useState(null);
  const [volatility, setVolatility] = useState(null);
  const [error, setError] = useState(null);
  const hostname = "localhost";
  const port = process.env.port || 5001;

  // Fetch stock data when the selected ticker changes
  useEffect(() => {
    let intervalId;

    const fetchInitialData = async () => {
      try {
        // First get the initial parameters
        const paramsResponse = await axios.get(
          `http://${hostname}:${port}/api/stock/${selectedTicker}/initial-parameters`
        );
        setDrift(paramsResponse.data.drift);
        setVolatility(paramsResponse.data.volatility);

        // Then get the stock data
        const stockResponse = await axios.get(
          `http://${hostname}:${port}/api/stock/${selectedTicker}`
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
      const response = await axios.post(`http://${hostname}:5001/api/stock/${selectedTicker}/parameters`, {
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
    // If ticker is not selected, load the header section and the full page background
    <div className={`App ${!selectedTicker ? 'gradient-bg' : ''}`} style={{ textAlign: "center", minHeight: '100vh' }}>
      <div className="header-section">
        <h1>Real-Time Stock Prices</h1>
        <h5>A web app by Hamzah Muhammad</h5>
        <h5>(t+1) stock price calculated using the GBM Formula</h5>
        <h2>Select a Stock Ticker to get started</h2>
        <SearchBar onSelectTicker={setSelectedTicker} />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    

      {selectedTicker && ( 
        // When a ticker is selected, load the StockChart and Parameters sections
        <>
          <div className="stock-chart-container">
            <StockChart data={stockData} />
          </div>
          <div className="parameters-section" style={{ textAlign: "center" }}>
            <Parameters
              drift={drift}
              volatility={volatility}
              onUpdate={handleParameterUpdate}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;