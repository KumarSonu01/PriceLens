import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./app/store";
import App from "./App";
import "./index.css";
import { CompareProvider } from "./features/compare/CompareContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <CompareProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  borderRadius: "10px",
                  background: "var(--color-surface)",
                  color: "var(--color-text)",
                  border: "1px solid var(--color-line)",
                  padding: "12px 18px",
                  fontSize: "13px",
                  fontWeight: "500",
                  boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.4)",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                },
                success: {
                  iconTheme: {
                    primary: "var(--color-signal)",
                    secondary: "#0B0D0C",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "var(--color-rise)",
                    secondary: "#0B0D0C",
                  },
                },
              }}
            />
            <App />
          </CompareProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);