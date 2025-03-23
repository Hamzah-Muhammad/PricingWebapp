import React, { useState } from "react";

function Parameters({ drift, volatility, onUpdate }) {
  const [newDrift, setNewDrift] = useState(drift);
  const [newVolatility, setNewVolatility] = useState(volatility);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(newDrift, newVolatility); // Call the onUpdate function
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Drift:
        <input
          type="number"
          step="0.0001"
          value={newDrift}
          onChange={(e) => setNewDrift(parseFloat(e.target.value))}
        />
      </label>
      <label>
        Volatility:
        <input
          type="number"
          step="0.01"
          value={newVolatility}
          onChange={(e) => setNewVolatility(parseFloat(e.target.value))}
        />
      </label>
      <button type="submit">Update Parameters</button>
    </form>
  );
}

export default Parameters;