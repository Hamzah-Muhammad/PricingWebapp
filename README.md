## Welcome to the Real Time Stock Pricing Web app

This is a single page web application built with a Node.js Backend and a React.js Frontend

The purpose of this web application is to visualize real-time stock prices

(t+1) stock price is calculated using the GBM Formula


## How to Run the App

Installation commands:

```
cd client
npm install
npm install axios chart.js react-chartjs-2
cd ../server
npm install express cors body-parser
```

To run the backend, navigate to `PricingWebapp/server` in your terminal and run:
```
node server.js
```

To run the frontend, navigate to `PricingWebapp/client` and run:
```
npm start
```

The webpage will pop up in your browser and the web app is ready to use!

If you want to add new data or edit data, navigate to `server/InitialData.json`

