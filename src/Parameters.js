import React, { useState } from "react";

function Parameters({ drift, volatility, onUpdate }) {
  const [newDrift, setNewDrift] = useState(drift);
  const [newVolatility, setNewVolatility] = useState(volatility);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (isNaN(newDrift) || isNaN(newVolatility) || newVolatility < 0) {
      alert("Please enter valid values. Volatility must be non-negative.");
      return;
    }
    
    // Call the onUpdate function with the new parameters
    onUpdate(newDrift, newVolatility);
  };

  return (
    <div style={{ display: "grid", placeItems: "center", height: "100%" }}>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px", width: "300px" }}>
        <label style={{ display: "grid", gap: "5px" }}>
          Drift:
          <input
            type="number"
            step="0.0001"
            value={newDrift}
            onChange={(e) => setNewDrift(parseFloat(e.target.value))}
            style={{ padding: "5px", width: "100%" }}
          />
        </label>
        <label style={{ display: "grid", gap: "5px" }}>
          Volatility:
          <input
            type="number"
            step="0.01"
            value={newVolatility}
            onChange={(e) => setNewVolatility(parseFloat(e.target.value))}
            style={{ padding: "5px", width: "100%" }}
          />
        </label>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          onMouseDown={(e) => (e.target.style.backgroundColor = "#004080")}
          onMouseUp={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Update Parameters
        </button>
      </form>
    </div>
  );
}

export default Parameters;