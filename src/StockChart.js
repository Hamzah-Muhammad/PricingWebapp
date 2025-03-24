import React, { useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";

// Register the required scales, elements, and plugins
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

function StockChart({ data }) {
  const chartRef = useRef(null);

  const chartData = {
    labels: data.map((point) => point.time), // Use all time labels
    datasets: [
      {
        label: "Stock Price",
        data: data.map((point) => point.price), // Use all price data
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
    ],
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
          title: () => "", 
          label: (context) => {
            const time = data[context.dataIndex].time; // Get the time for the point on the graph
            const price = context.raw.toFixed(2); // Get the price for the point on the graph
            return `Time: ${time}, Price: $${price}`; // Display both time and price
          },
        },
      },
    },
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Time",
          color: "#666",
          font: {
            size: 14,
            weight: "bold",
          },
          padding: { top: 10, bottom: 10 },
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
          font: {
            size: 12,
          },
          // Show labels only every 15 minutes since we are giving data on the graph every 1min 
          callback: (value, index, values) => {
            const time = data[index].time;
            const minutes = parseInt(time.split(":")[1], 10);
            return minutes % 15 === 0 ? time : null; // Show label only if minutes are divisible by 15
          },
        },
      },
      y: {
        type: "linear",
        title: {
          display: true,
          text: "Price (USD)",
          color: "#666",
          font: {
            size: 14,
            weight: "bold",
          },
          padding: { top: 0, bottom: 10 },
        },
        grid: {
          color: "#eee",
        },
        ticks: {
          color: "#666",
          font: {
            size: 12,
          },
        },
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