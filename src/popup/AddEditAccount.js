import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AccountCircle } from "@mui/icons-material";
import { FormControl, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import Identicon from "@polkadot/react-identicon";
import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DoneIcon from '@mui/icons-material/Done';
import { updateAccount, watchAccount } from "./messaging";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useAccounts } from "./context";
import { collaterals } from "~/types";
const AddEditAccount = ({ className }) => {
    const { accountKey } = useParams();
    const navigate = useNavigate();
    const [collateral, setCollateral] = useState("LKSM");
    const [address, setAddress] = useState("");
    const isEditing = useMemo(() => !!accountKey, [accountKey]);
    const { accounts, refreshAccounts } = useAccounts();
    const account = useMemo(() => {
        if (!accountKey)
            return;
        return accounts.find((account) => account.key === accountKey);
    }, [accountKey, accounts]);
    const [threshold, setThreshold] = useState(account?.threshold || 200);
    const onCollateralChange = useCallback((event) => {
        const { target: { value } } = event;
        setCollateral(value);
    }, []);
    const onAddressChange = useCallback((event) => {
        setAddress(event.target.value);
    }, []);
    const onThresholdChange = useCallback((event) => {
        setThreshold(Number(event.target.value));
    }, []);
    const onGoBack = useCallback(() => {
        navigate('/');
    }, [navigate]);
    const watchNewAccount = useCallback(() => {
        watchAccount({ address, token1: collateral, token2: "KSM", threshold })
            .then((res) => {
            if (res) {
                refreshAccounts();
                onGoBack();
                return;
            }
            console.error('Something wrong happened when adding account');
        })
            .catch(console.error);
    }, [address, collateral, onGoBack, refreshAccounts, threshold]);
    const updateAccountThreshold = useCallback(() => {
        if (!accountKey) {
            console.error('Called updateAccount without an account key');
            return;
        }
        updateAccount({ accountKey, threshold })
            .then((res) => {
            if (res) {
                refreshAccounts();
                onGoBack();
                return;
            }
            console.error('Something wrong happened when updating account');
        })
            .catch(console.error);
    }, [accountKey, onGoBack, refreshAccounts, threshold]);
    const onSave = useCallback(() => {
        if (isEditing) {
            updateAccountThreshold();
        }
        else {
            watchNewAccount();
        }
    }, [isEditing, updateAccountThreshold, watchNewAccount]);
    return (_jsxs("div", { className: className, children: [_jsxs("div", { className: 'inputs', children: [_jsxs(FormControl, { className: "addressInput", children: [!(account?.address || address)
                                ? _jsx(AccountCircle, { sx: { color: 'action.active', mr: 1, my: 0.5 } })
                                : _jsx(Identicon, { className: "identicon", value: isEditing ? account?.address : address, size: 24, theme: "polkadot" }), _jsx(TextField, { id: "addressInput", label: "Account address", value: isEditing ? account?.address : address, onChange: onAddressChange, disabled: isEditing })] }), _jsxs("div", { className: "secondRow", children: [_jsxs(FormControl, { className: "collateralSelect", children: [_jsx(InputLabel, { id: "collateral-select", children: "Collateral" }), _jsx(Select, { labelId: "collateral-select", id: "collateral-select", value: isEditing ? account?.token1 : collateral, onChange: onCollateralChange, input: _jsx(OutlinedInput, { label: "Collateral" }), disabled: isEditing, children: collaterals.map((collateralOption) => (_jsx(MenuItem, { value: collateralOption, children: collateralOption }, collateralOption))) })] }), _jsx(FormControl, { className: "thresholdInput", children: _jsx(TextField, { id: "threshold-input", label: "Alert ratio", value: isEditing ? threshold : account?.threshold, onChange: onThresholdChange, InputProps: {
                                        endAdornment: _jsx(InputAdornment, { position: "end", children: "%" }),
                                        startAdornment: _jsx(InputAdornment, { position: "start", children: _jsx(NotificationsNoneIcon, { className: "icon" }) })
                                    } }) })] })] }), _jsxs("div", { className: "buttonArea", children: [_jsx(IconButton, { className: 'iconButton', onClick: onGoBack, children: _jsx(ArrowBackIcon, {}) }), _jsx(IconButton, { className: 'iconButton', onClick: onSave, children: _jsx(DoneIcon, {}) })] })] }));
};
export default styled(AddEditAccount)(({ theme }) => `
    display: flex;
    flex-direction: column;
    height: 100%;

    .inputs {
        flex: 1;
    }
    
    .collateralSelect, .addressInput, .thresholdInput {
        background: ${theme.palette.background.color.secondary};
        & > label, .MuiInputLabel-root {
            color: ${theme.palette.text.color.primary};
        }

        .Mui-disabled {
            -webkit-text-fill-color: ${theme.palette.text.color.disabled};
        }

        .MuiSvgIcon-root {
            color: ${theme.palette.text.color.primary};
        }
    }

    .MuiInputBase-input, .MuiFormLabel-root, .MuiInputAdornment-root > p {
        color: ${theme.palette.text.color.primary}
    }


    .MuiInputBase-root.Mui-focused > fieldset {
        border-color: ${theme.palette.text.color.primary}
    }

    .addressInput {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 1rem;
        padding-left: .5rem;
    }

    .buttonArea {
        flex: 1
        margin-top: .5rem;
        text-align: center;
    }

    .identicon {
        margin-right: 0.5rem;
    }

    .secondRow {
        display: flex;
        flex-direction: row;

        .collateralSelect, .thresholdInput {
            flex: 1
        }

        #threshold-input {
            text-align: right;
        }
    }

    .iconButton {
        background: ${theme.palette.background.color.secondary};
        color: ${theme.palette.text.color.primary};

        &:last-of-type {
                margin-left: 1rem;
            }

        &:hover {
            color: ${theme.palette.text.color.hover};
        }
    }
`);
