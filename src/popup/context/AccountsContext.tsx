import React, { ReactNode, useCallback, useEffect, useState } from "react"
import { WatchInfoResponse } from "~/types";
import { getAccountsInfo } from "../messaging";

type AccountsContextProviderProps = {
    children: ReactNode | ReactNode[]
}

interface AccountsContextProps {
    accounts: WatchInfoResponse;
    refreshAccounts: () => void;
}

const AccountsContext = React.createContext<AccountsContextProps | undefined>(undefined)

const AccountsContextProvider = ({ children }: AccountsContextProviderProps) => {
    const [accounts, setAccounts] = useState<WatchInfoResponse>([]);

    const refreshAccounts = useCallback(() => {
        getAccountsInfo()
            .then(setAccounts)
            .catch(console.error)
    }, [])

    useEffect(() => {
        refreshAccounts()
    }, [refreshAccounts])

    return (
        <AccountsContext.Provider
            value={{
                accounts,
                refreshAccounts
            }}
        >
            {children}
        </AccountsContext.Provider>
    )
}

const useAccounts = () => {
    const context = React.useContext(AccountsContext)
    if (context === undefined) {
        throw new Error("useTx must be used within a TxContext")
    }
    return context
}

export { AccountsContextProvider, useAccounts }