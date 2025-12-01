import React from "react";
import ReactDOM from "react-dom/client";
import { Global, ThemeProvider } from "@emotion/react";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import { resetStyles } from "./styles/reset-styles";
import { routeTree } from "./routeTree.gen";
import theme from "./theme";

import "./index.css";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Global styles={resetStyles} />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
