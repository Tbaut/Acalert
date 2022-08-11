import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from "react-router-dom";
import styled from "styled-components";
import Home from "./Home";
import AddEditAccount from "./AddEditAccount";
const Popup = ({ className }) => {
    return (_jsx("div", { className: className, children: _jsxs(Routes, { children: [_jsx(Route, { index: true, element: _jsx(Home, {}) }), _jsx(Route, { path: "*", element: _jsx(Home, {}) }), _jsx(Route, { path: "edit/:accountKey", element: _jsx(AddEditAccount, {}) }), _jsx(Route, { path: "add", element: _jsx(AddEditAccount, {}) })] }) }));
};
export default styled(Popup)(({ theme }) => `
  padding: 1rem;
  box-sizing: border-box;
  background:  ${theme.palette.background.color.primary};
  color: ${theme.palette.text.color.primary};
  font-family: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue";
  height: 100%;
`);
