import React, { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

function StockChart({ data, ticker }) {
  const chartRef = useRef(null);

  // Time formatting Function 
  const formatTimeWithAMPM = (timeString) => {
    if (!timeString) return '';
    
    // Extract time parts
    const timeParts = timeString.split(' ');
    let [hours, minutes] = timeParts[0].split(':');
    let hourNum = parseInt(hours, 10);
    let ampm = timeParts[1] || '';
    
    // If already has AM/PM, verify it's correct
    if (ampm) {
      const shouldBePM = hourNum >= 12 && hourNum < 24;
      if ((shouldBePM && ampm === 'AM') || (!shouldBePM && ampm === 'PM')) {
        // Fix incorrect AM/PM
        ampm = shouldBePM ? 'PM' : 'AM';
      }
    } else {
      // Determine AM/PM for 24-hour format
      ampm = hourNum >= 12 && hourNum < 24 ? 'PM' : 'AM';
    }
    
    hourNum = hourNum % 12 || 12; // Convert 0 or 24 to 12
    
    return `${hourNum}:${minutes} ${ampm}`;
  };

  const currentPrice = data.length > 0 ? data[data.length - 1].price : null;

  const chartData = {
    labels: data.map(p => p.time),
    datasets: [{
      label: "Stock Price",
      data: data.map(p => p.price),
      borderColor: "#0A84FF",
      backgroundColor: "rgba(10, 132, 255, 0.08)",
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "#3FA2FF",
      pointHoverBorderColor: "#0A84FF",
      tension: 0.15,
      fill: true
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        backgroundColor: "#18181F",
        titleColor: "#F2F2F7",
        bodyColor: "#3FA2FF",
        borderColor: "#242430",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => formatTimeWithAMPM(context[0].label),
          label: (context) => `$${context.parsed.y.toFixed(2)}`     //Fixed to 2 decimal places
        }
      },
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Time (EST)', // X axis label
          color: '#7C7C86',
          font: {
            size: 12,
            weight: 'bold'
          },
          padding: { top: 10, bottom: 10 }
        },
        ticks: {
          callback: (value, index) => {
            const time = data[index]?.time;
            if (!time) return undefined;
            const formattedTime = formatTimeWithAMPM(time);
            const minutes = time.includes(':') ? time.split(':')[1].split(' ')[0] : '00';
            return parseInt(minutes) % 15 === 0 ? formattedTime : undefined; // Only show every 15 minutes on the X axis
          },                                                                 // Not neccessary but 1 minute charts usually
          autoSkip: false,                                                   // display 15m intervals on the x-axis
          maxRotation: 0,
          minRotation: 0,
          color: '#7C7C86',
          font: {
            size: 8,
            family: "'JetBrains Mono', monospace"
          }
        },
        grid: {
          display: false
        },
        border: {
          color: '#242430'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Price (USD)', // Y axis label
          color: '#7C7C86',
          font: {
            size: 12,
            weight: 'bold'
          },
          padding: { top: 0, bottom: 10 }
        },
        ticks: {
          color: '#7C7C86',
          font: {
            size: 12,
            family: "'JetBrains Mono', monospace"
          }
        },
        grid: {
          color: '#1B1B22'
        },
        border: {
          color: '#242430'
        }
      }
    }
  };

  useEffect(() => {
    const chartInstance = chartRef.current;
    return () => {
      if (chartInstance) chartInstance.destroy();  // Destroy chart to generate a new one 
    };
  }, [ticker]);

  return (
    <div className="stock-chart-wrapper">
      <div className="chart-readout">
        <span className="chart-readout-ticker">{ticker}</span>
        {currentPrice !== null && (
          <span className="chart-readout-price">${currentPrice.toFixed(2)}</span>
        )}
      </div>
      <div className="chart-canvas-area">
        <Line
          ref={chartRef}
          data={chartData}
          options={options}
          key={ticker}
        />
      </div>
    </div>
  );
}

export default StockChart;