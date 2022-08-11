import { jsx as _jsx } from "react/jsx-runtime";
import React, { useCallback, useEffect, useState } from "react";
import { getAccountsInfo } from "../messaging";
const AccountsContext = React.createContext(undefined);
const AccountsContextProvider = ({ children }) => {
    const [accounts, setAccounts] = useState([]);
    const refreshAccounts = useCallback(() => {
        getAccountsInfo()
            .then(setAccounts)
            .catch(console.error);
    }, []);
    useEffect(() => {
        refreshAccounts();
    }, [refreshAccounts]);
    return (_jsx(AccountsContext.Provider, { value: {
            accounts,
            refreshAccounts
        }, children: children }));
};
const useAccounts = () => {
    const context = React.useContext(AccountsContext);
    if (context === undefined) {
        throw new Error("useTx must be used within a TxContext");
    }
    return context;
};
export { AccountsContextProvider, useAccounts };
