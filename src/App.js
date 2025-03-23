import React, { useState, useEffect } from "react";
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
    if (selectedTicker) {
      fetchStockData();
    }
  }, [selectedTicker]);

  const fetchStockData = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/stock/${selectedTicker}`);
      setStockData(response.data.prices);
      setError(null);
    } catch (err) {
      setError("Failed to fetch stock data. Please check the backend server.");
      console.error(err);
    }
  };

  const handleParameterUpdate = async (newDrift, newVolatility) => {
    try {
      // Send the updated parameters to the backend
      const response = await axios.post(`http://localhost:5001/api/stock/${selectedTicker}/parameters`, {
        drift: newDrift,
        volatility: newVolatility,
      });

      // Append the new price to the chart
      const newPrice = response.data.price;
      const newTime = new Date().toLocaleTimeString(); // Use the current time for the new data point
      setStockData((prevData) => [
        ...prevData,
        { time: newTime, price: newPrice },
      ]);

      // Update the local state with the new parameters
      setDrift(newDrift);
      setVolatility(newVolatility);
    } catch (err) {
      setError("Failed to update parameters. Please check the backend server.");
      console.error(err);
    }
  };

  return (
    <div className="App">
      <h1>Real-Time Stock Prices</h1>
      <SearchBar onSelectTicker={setSelectedTicker} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {selectedTicker && (
        <>
          <div style={{ width: "100%", height: "400px" }}>
            <StockChart data={stockData} />
          </div>
          <Parameters
            drift={drift}
            volatility={volatility}
            onUpdate={handleParameterUpdate}
          />
        </>
      )}
    </div>
  );
}

export default App;