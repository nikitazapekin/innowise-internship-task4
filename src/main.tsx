import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client/core";
import { ApolloProvider } from "@apollo/client/react";
import { css, Global, ThemeProvider } from "@emotion/react";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import { resetStyles } from "./styles/reset-styles";
import { emotionTheme, globalStyles } from "./styles/theme";
import { routeTree } from "./routeTree.gen";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://graphqlzero.almansi.me/api",
  }),
  cache: new InMemoryCache(),
});

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider theme={emotionTheme}>
        <Global styles={resetStyles} />
        <Global
          styles={css`
            ${globalStyles.global(emotionTheme)}
          `}
        />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>
);
