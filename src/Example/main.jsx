import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "../Core";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
