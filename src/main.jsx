import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Mount into #ui-root so A-Frame's canvas is untouched
ReactDOM.createRoot(document.getElementById("ui-root")).render(<App />);
