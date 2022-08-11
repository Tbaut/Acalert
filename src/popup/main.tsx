import "../styles";
import React from "react";
import ReactDOM from "react-dom";
import Popup from "./Popup";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";
import { BrowserRouter } from "react-router-dom";
import { AccountsContextProvider } from "./context";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AccountsContextProvider>
          <Popup />
        </AccountsContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
