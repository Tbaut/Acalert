import styled from "styled-components";
import Identicon from "@polkadot/react-identicon";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useCallback, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import { useAccounts } from "../context";
import { WatchInfoWithKey } from "~/types";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../messaging";

interface Props {
    className?: string
    accountInfos: WatchInfoWithKey
}

const AccountInfo = ({ className, accountInfos: { ratio, address, threshold, key } }: Props) => {
    const [isOver, setIsOver] = useState(false);
    const { refreshAccounts } = useAccounts()
    const navigate = useNavigate()

    const handleMouseEnter = useCallback(() => {
        setIsOver(true)
    }, [])

    const handleMouseLeave = useCallback(() => {
        setIsOver(false)
    }, [])

    const handleEditClick = useCallback(() => {
        navigate(`edit/${key}`)
    }, [key, navigate])

    const handleDeleteClick = useCallback(() => {
        deleteAccount({ accountKey: key })
            .then(() => refreshAccounts())
            .catch(console.error)
    }, [key, refreshAccounts])

    const handleRefreshClick = useCallback(() => {
        refreshAccounts()
    }, [refreshAccounts])

    return (
        <div
            className={`${ratio !== -1 && ratio < threshold ? "red" : "green"} ${className}`}
            onMouseOver={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={() => console.log('focus')}
        >
            {isOver && (<div className="overMenu">
                <RefreshIcon onClick={handleRefreshClick} className="menuIcon" />
                <EditIcon onClick={handleEditClick} className="menuIcon" />
                <DeleteIcon onClick={handleDeleteClick} className="menuIcon" />
            </div>
            )
            }
            <Identicon
                value={address}
                size={24}
                theme={"polkadot"}
            />
            <div className="address">{address}</div>
            <div className="threshold">
                <NotificationsNoneIcon className="icon" />
                {threshold}
            </div>
            <div className="ratio">
                {ratio === -1
                    ? "-"
                    : ratio.toFixed(2)}%
            </div>
        </div>
    )
}

export default styled(AccountInfo)(({ theme }) => `

    background: ${theme.palette.background.color.secondary};
    padding: 0.5rem 1rem;
    border-radius: ${theme.shape.borderRadius};
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: .5rem;

    .overMenu {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: ${theme.palette.background.color.overMenu};
        border-right-color: ${theme.palette.border.overMenu.color};
        border-right-style: ${theme.palette.border.overMenu.style};
        border-right-width: ${theme.palette.border.overMenu.width};
        border-radius: ${theme.shape.borderRadius};

        .menuIcon {
            &:not(:first-child) {
                margin-left: 1rem;
            }
            cursor: pointer;

            &:hover {
                color: ${theme.palette.text.color.hover};
            }
        }
    }

    &.green {
        border-right-color: ${theme.palette.border.valid.color};
        border-right-style: ${theme.palette.border.valid.style};
        border-right-width: ${theme.palette.border.valid.width};
    }

    &.red {
        border-right-color: ${theme.palette.border.invalid.color};
        border-right-style: ${theme.palette.border.invalid.style};
        border-right-width: ${theme.palette.border.invalid.width};
    }

    
    .address, .threshold, .ratio {
        margin-left: .5rem
    }

    .address {
        width: 4rem;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .ratio {
        flex: 1;
        text-align: right
    }

    .threshold {
        .icon {
            font-size: 1.2rem;
        }

        font-size: .8rem;
        height: 14px;
        display: flex;
        align-items: center;
    }
`)