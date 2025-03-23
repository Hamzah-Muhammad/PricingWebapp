import React, { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";

// Register the required scales and elements
Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

function StockChart({ data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = chartRef.current;

    return () => {
      // Destroy the chart instance when the component unmounts
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  const chartData = {
    labels: data.map((point) => point.time),
    datasets: [
      {
        label: "Stock Price",
        data: data.map((point) => point.price),
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true, // Make the chart responsive
    maintainAspectRatio: false, // Allow the chart to resize freely
    scales: {
      x: {
        type: "category", // Ensure the x-axis uses the 'category' scale
      },
      y: {
        type: "linear", // Ensure the y-axis uses the 'linear' scale
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
}

export default StockChart;