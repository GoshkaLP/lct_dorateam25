import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { UserProfileProvider, queryClient } from "../src/store/UserProfile";

import App from "./components/App/App";
import reportWebVitals from "./reportWebVitals";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    <UserProfileProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserProfileProvider>
  </QueryClientProvider>
);

reportWebVitals();
