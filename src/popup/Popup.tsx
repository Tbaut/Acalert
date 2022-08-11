
import { Routes, Route } from "react-router-dom";
import styled from "styled-components";
import Home from "./Home";
import AddEditAccount from "./AddEditAccount";

interface Props {
  className?: string
}

const Popup = ({ className }: Props) => {

  return (
    <div className={className}>
      <Routes>
        <Route index element={<Home />} />
        <Route path="*" element={<Home />} />
        <Route path="edit/:accountKey" element={<AddEditAccount />} />
        <Route path="add" element={<AddEditAccount />} />
      </Routes>
    </div>
  );
};

export default styled(Popup)(({ theme }) => `
  padding: 1rem;
  box-sizing: border-box;
  background:  ${theme.palette.background.color.primary};
  color: ${theme.palette.text.color.primary};
  font-family: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue";
  height: 100%;
`)