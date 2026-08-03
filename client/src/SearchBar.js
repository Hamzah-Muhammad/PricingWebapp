import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "./config";

function SearchBar({ onSelectTicker }) {
  const [tickers, setTickers] = useState([]); // State to store the tickers

  // Fetch tickers from the API when the component mounts
  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tickers`);
        setTickers(response.data); // Update the state with the fetched tickers
      } catch (error) {
        console.error("Error fetching tickers:", error);
      }
    };

    fetchTickers();
  }, []); // Ensures this runs only once on mount

  return (
    <select className="ticker-select" onChange={(e) => onSelectTicker(e.target.value)} defaultValue="">
      <option value="" disabled>
        Select a ticker
      </option>
      {tickers.map((ticker) => (
        <option key={ticker} value={ticker}>
          {ticker}
        </option>
      ))}
    </select>
  );
}

export default SearchBar;
