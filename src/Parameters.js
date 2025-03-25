import React, { useState, useEffect } from "react";

function Parameters({ drift, volatility, onUpdate }) {
  
  const [newDrift, setNewDrift] = useState(drift);
  const [newVolatility, setNewVolatility] = useState(volatility);
  const [showSuccess, setShowSuccess] = useState(false);

  // Effect to sync local state with props when they change
  useEffect(() => {
    setNewDrift(drift);
    setNewVolatility(volatility);
  }, [drift, volatility]);

  // Effect to automatically hide success message after 3 seconds
  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => setShowSuccess(false), 3000);
    }
    return () => clearTimeout(timer); 
  }, [showSuccess]);

  /**
   * Handles form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (isNaN(newDrift) || isNaN(newVolatility) || newVolatility < 0) {
      alert("Please enter valid values. Volatility must be non-negative.");
      return;
    }
    
    // Convert to numbers and call parent update function
    onUpdate(Number(newDrift), Number(newVolatility));
    setShowSuccess(true); // Show success notification
  };

  return (
    <>
      {/* Parameters Header Section */}
      <div className="parameters-header-section">
        <h2>Edit the Stock Parameters below</h2>
      </div>
      
      {/* Main Parameters Container */}
      <div className="parameters-container">
        <div className="parameters-card">
          <form onSubmit={handleSubmit} className="parameters-form">
            {/* Drift Input Group */}
            <div className="param-group">
              <label className="param-label">Drift</label>
              <input
                type="number"
                step="0.0001"  // Allows 4 decimal places
                value={newDrift}
                onChange={(e) => setNewDrift(e.target.value)}
                className="param-input"
              />
            </div>
            
            {/* Volatility Input Group */}
            <div className="param-group">
              <label className="param-label">Volatility</label>
              <input
                type="number"
                step="0.01"     // Allows 2 decimal places
                min="0"         // Prevents negative values
                value={newVolatility}
                onChange={(e) => setNewVolatility(e.target.value)}
                className="param-input"
              />
            </div>
            
            {/* Submit Button */}
            <button type="submit" className="submit-btn">
              Update Parameters
            </button>
          </form>
        </div>

        {/* Success Notification*/}
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