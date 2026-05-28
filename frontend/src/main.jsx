import React from "react";

import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import { Provider } from "react-redux";

import { Toaster } from "react-hot-toast";

import { store } from "./app/store";

import App from "./App";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,

            style: {
              borderRadius:
                "14px",

              background:
                "#111",

              color: "#fff",

              padding:
                "14px 18px",

              fontWeight:
                "600",
            },

            success: {
              iconTheme: {
                primary:
                  "#22c55e",

                secondary:
                  "#fff",
              },
            },

            error: {
              iconTheme: {
                primary:
                  "#ef4444",

                secondary:
                  "#fff",
              },
            },
          }}
        />

        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);