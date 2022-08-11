// import { createSubscription, unsubscribe } from "./subscriptions";
export default class Extension {
    #state;
    constructor(state) {
        this.#state = state;
    }
    // private accountsSubscribe(id: string, port: browser.Runtime.Port): boolean {
    //     const cb = createSubscription<'pri(accounts.subscribe)'>(id, port);
    //     const subscription = accountsObservable.subject.subscribe((accounts: SubjectInfo): void =>
    //         cb(accounts)
    //     );
    //     port.onDisconnect.addListener((): void => {
    //         unsubscribe(id);
    //         subscription.unsubscribe();
    //     });
    //     return true;
    // }
    handleAddWatchingAccount({ address, token1, token2, threshold }) {
        return this.#state.addWatchingAddress(address, token1, token2, threshold);
    }
    handleUpdateAccount(request) {
        return this.#state.updateAccount(request);
    }
    handleDeleteWatchingAccount(request) {
        return this.#state.deleteWatchingAddress(request);
    }
    handleAccountsGetInfo() {
        this.#state.updateIcon();
        return Object.entries(this.#state.watchlist).map(([key, value]) => ({ key, ...value }));
    }
    async handle(id, type, request, port, api) {
        switch (type) {
            case 'pri(account.watch)':
                return this.handleAddWatchingAccount(request);
            case 'pri(account.update)':
                return this.handleUpdateAccount(request);
            case 'pri(account.delete)':
                return this.handleDeleteWatchingAccount(request);
            case 'pri(accounts.getInfo)':
                return this.handleAccountsGetInfo();
            // case 'pri(accounts.subscribe)':
            //     return this.accountsSubscribe(id, port);
            default:
                throw new Error(`Unable to handle message of type ${type}`);
        }
    }
}
