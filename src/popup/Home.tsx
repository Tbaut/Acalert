import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AccountInfo from "./components/AccountInfo";
import { useAccounts } from "./context";

interface Props {
    className?: string
}

const Home = ({ className }: Props) => {
    const { accounts } = useAccounts()
    const navigate = useNavigate()


    return <div className={className}>
        {accounts.length === 0 && (
            <div className="noPostionText">
                Add an account postion to get started!
            </div>
        )}
        <div className="accounts">
            {accounts.map((accountInfo) =>
                <AccountInfo
                    accountInfos={accountInfo}
                    key={accountInfo.key}
                />
            )}
        </div>
        <div className="buttonArea">
            <IconButton
                className="addButton"
                onClick={() => navigate('/add')}
            >
                <AddIcon />
            </IconButton>
        </div>
    </div>;
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
`)