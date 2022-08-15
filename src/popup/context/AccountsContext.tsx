import React, { ReactNode, useCallback, useEffect, useState } from "react"
import { WatchInfoResponse } from "~/types";
import { getAccountsInfo, subscribeAccounts } from "../messaging";

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
    console.log('hop')

    const refreshAccounts = useCallback(() => {
        getAccountsInfo()
            .then(setAccounts)
            .catch(console.error)
    }, [])

    useEffect(() => {
        refreshAccounts()
        console.log('subscribe')
        subscribeAccounts((res) => console.log(res))
            .catch(console.error)
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