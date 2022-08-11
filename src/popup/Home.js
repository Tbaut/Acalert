import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AccountInfo from "./components/AccountInfo";
import { useAccounts } from "./context";
const Home = ({ className }) => {
    const { accounts } = useAccounts();
    const navigate = useNavigate();
    return _jsxs("div", { className: className, children: [accounts.length === 0 && (_jsx("div", { className: "noPostionText", children: "Add an account postion to get started!" })), _jsx("div", { className: "accounts", children: accounts.map((accountInfo) => _jsx(AccountInfo, { accountInfos: accountInfo }, accountInfo.key)) }), _jsx("div", { className: "buttonArea", children: _jsx(IconButton, { className: "addButton", onClick: () => navigate('/add'), children: _jsx(AddIcon, {}) }) })] });
};
export default styled(Home)(({ theme }) => `
    display: flex;
    height: 100%;
    flex-direction: column;

    .accounts {
        flex: 1;
    }

    .buttonArea {
        margin-top: .5rem;
        text-align: center;
    }

    .noPostionText {
        text-align: center;
    }

    .addButton {
        background: ${theme.palette.background.color.secondary};
        color: ${theme.palette.text.color.primary};

        &:hover {
            color: ${theme.palette.text.color.hover};
        }
    }
`);
