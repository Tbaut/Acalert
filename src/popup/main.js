import { jsx as _jsx } from "react/jsx-runtime";
import "../styles";
import React from "react";
import Popup from "./Popup";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";
import { BrowserRouter } from "react-router-dom";
import { AccountsContextProvider } from "./context";
import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(_jsx(React.StrictMode, { children: _jsx(BrowserRouter, { children: _jsx(ThemeProvider, { theme: theme, children: _jsx(AccountsContextProvider, { children: _jsx(Popup, {}) }) }) }) }));
