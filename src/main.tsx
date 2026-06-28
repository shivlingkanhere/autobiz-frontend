import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setBaseUrl } from "@workspace/api-client-react";

const queryClient = new QueryClient();

// IMPORTANT: API BASE URL SET
setBaseUrl(import.meta.env.VITE_API_URL);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);