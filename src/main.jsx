import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/home.css";
import "./styles/explore.css";
import "./styles/trips.css";
import "./styles/itinerary.css";
import "./styles/budget.css";
import "./styles/checklist.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
