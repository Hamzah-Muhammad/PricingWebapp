import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import SearchBar from "./SearchBar";
import StockChart from "./StockChart";
import Parameters from "./Parameters";

function App() {
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [drift, setDrift] = useState(0.0002);
  const [volatility, setVolatility] = useState(0.05);
  const [error, setError] = useState(null);

  // Fetch stock data when the selected ticker changes
  useEffect(() => {
    let intervalId;

    const fetchStockData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/stock/${selectedTicker}`);
        console.log("Fetched new data:", response.data.prices); // Log the fetched data
        setStockData(response.data.prices); // Replace old data with new data
        setError(null);
      } catch (err) {
        setError("Failed to fetch stock data. Please check the backend server.");
        console.error(err);
      }
    };

    if (selectedTicker) {
      fetchStockData(); // Fetch data immediately when ticker is selected
      intervalId = setInterval(fetchStockData, 60000); // Fetch data every minute
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId); // Clear when the ticket name is changed
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
      const response = await axios.post(`http://localhost:5001/api/stock/${selectedTicker}/parameters`, {
        drift: newDrift,
        volatility: newVolatility,
      });
  
      // Log the backend response
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
    <div className="App" style={{ textAlign: "center" }}>
      <div className="header-section">
        <h1>Real-Time Stock Prices</h1>
        <h5>A web app by Hamzah Muhammad</h5>
        <h2>Select a Stock Ticker to get started</h2>
        <SearchBar onSelectTicker={setSelectedTicker} />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {selectedTicker && (
        <>
          <div className="stock-chart-container">
            <StockChart data={stockData} />
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
    </div>
  );
}

export default App;