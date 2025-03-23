import React, { useEffect, useState } from "react";

function SearchBar({ onSelectTicker }) {
  const [tickers, setTickers] = useState([]); // State to store the tickers

  // Fetch tickers from the API when the component mounts
  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/tickers");
        if (!response.ok) {
          throw new Error("Failed to fetch tickers");
        }
        const data = await response.json();
        setTickers(data); // Update the state with the fetched tickers
      } catch (error) {
        console.error("Error fetching tickers:", error);
      }
    };

    fetchTickers();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div>
      <select onChange={(e) => onSelectTicker(e.target.value)}>
        <option value="">Select a ticker</option>
        {tickers.map((ticker) => (
          <option key={ticker} value={ticker}>
            {ticker}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SearchBar;
