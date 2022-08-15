import React, { ReactNode, useEffect, useState } from "react"
import { FlatWatchList } from "~/types";
import { subscribeAccounts } from "../messaging";

type AccountsContextProviderProps = {
    children: ReactNode | ReactNode[]
}

interface AccountsContextProps {
    accounts: FlatWatchList;
}

const AccountsContext = React.createContext<AccountsContextProps | undefined>(undefined)

const AccountsContextProvider = ({ children }: AccountsContextProviderProps) => {
    const [accounts, setAccounts] = useState<FlatWatchList>([]);

    useEffect(() => {
        subscribeAccounts((res) => {
            setAccounts(Object.entries(res).map(([key, value]) => ({ key, ...value })))
        })
            .catch(console.error)
    }, [])

    return (
        <AccountsContext.Provider
            value={{
                accounts
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