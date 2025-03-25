import React, { useState, useEffect } from "react";

function Parameters({ drift, volatility, onUpdate }) {
  const [newDrift, setNewDrift] = useState(drift);
  const [newVolatility, setNewVolatility] = useState(volatility);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setNewDrift(drift);
    setNewVolatility(volatility);
  }, [drift, volatility]);

  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => setShowSuccess(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isNaN(newDrift) || isNaN(newVolatility) || newVolatility < 0) {
      alert("Please enter valid values. Volatility must be non-negative.");
      return;
    }
    onUpdate(Number(newDrift), Number(newVolatility));
    setShowSuccess(true);
  };

  return (
    <>
      <div className="parameters-header-section">
        <h2>Edit the Stock Parameters below</h2>
      </div>
      
      <div className="parameters-container">
        <div className="parameters-card">
          <form onSubmit={handleSubmit} className="parameters-form">
            <div className="param-group">
              <label className="param-label">Drift</label>
              <input
                type="number"
                step="0.0001"
                value={newDrift}
                onChange={(e) => setNewDrift(e.target.value)}
                className="param-input"
              />
            </div>
            
            <div className="param-group">
              <label className="param-label">Volatility</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newVolatility}
                onChange={(e) => setNewVolatility(e.target.value)}
                className="param-input"
              />
            </div>
            
            <button type="submit" className="submit-btn">
              Update Parameters
            </button>
          </form>
        </div>

        {showSuccess && (
          <div className="success-notification">
            <div className="success-message">
              ✓ Parameters updated successfully!
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Parameters;