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

  const chartData = {
    labels: data.map(p => p.time),
    datasets: [{
      label: "Stock Price",
      data: data.map(p => p.price),
      borderColor: "rgba(75,192,192,1)",
      borderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 5,
      fill: false
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
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#fff",
        borderWidth: 1,
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
          color: '#666',
          font: {
            size: 14,
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
          color: '#666',
          font: {
            size: 8,
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        title: {
          display: true,
          text: 'Price (USD)', // Y axis label
          color: '#666',
          font: {
            size: 14,
            weight: 'bold'
          },
          padding: { top: 0, bottom: 10 }
        },
        ticks: {
          color: '#666',
          font: {
            size: 12
          }
        },
        grid: {
          color: '#eee'
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
    <div className="stock-chart-container">
      <div className="stock-chart-wrapper">
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