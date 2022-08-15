import { AccountDeleteRequest, AccountUpdateRequest, AccountWatchRequest, MessageTypes, RequestTypes, ResponseType } from "~/types";
import State from "./State";
import browser from "webextension-polyfill";
import { ApiPromise } from "@polkadot/api";
import { createSubscription, unsubscribe } from "./subscriptions";
import { interval } from "rxjs";

export default class Extension {
    readonly #state: State;

    constructor(state: State) {
        this.#state = state;
    }

    private accountsSubscribe(id: string, port: browser.Runtime.Port): boolean {
        const cb = createSubscription<'pri(accounts.subscribe)'>(id, port);

        const subscription = interval(1000).subscribe((someNumb): void =>
            cb({
                "hey": {
                    address: someNumb.toString(),
                    threshold: 42,
                    ratio: 43,
                    token1: "LKSM",
                    token2: "KSM"
                }
            })
        );

        port.onDisconnect.addListener((): void => {
            unsubscribe(id);
            subscription.unsubscribe();
        });

        return true;
    }

    private handleAddWatchingAccount({ address, token1, token2, threshold }: AccountWatchRequest) {
        return this.#state.addWatchingAddress(address, token1, token2, threshold)
    }
    private handleUpdateAccount(request: AccountUpdateRequest) {
        return this.#state.updateAccount(request)
    }
    private handleDeleteWatchingAccount(request: AccountDeleteRequest) {
        return this.#state.deleteWatchingAddress(request)
    }

    private handleAccountsGetInfo() {
        this.#state.updateIcon()
        return Object.entries(this.#state.watchlist).map(([key, value]) => ({ key, ...value }))
    }

    public async handle<TMessageType extends MessageTypes>(id: string, type: TMessageType, request: RequestTypes[TMessageType], port: browser.Runtime.Port, api: ApiPromise): Promise<ResponseType<TMessageType>> {

        switch (type) {
            case 'pri(account.watch)':
                return this.handleAddWatchingAccount(request as AccountWatchRequest)
            case 'pri(account.update)':
                return this.handleUpdateAccount(request as AccountUpdateRequest)
            case 'pri(account.delete)':
                return this.handleDeleteWatchingAccount(request as AccountDeleteRequest)
            case 'pri(accounts.getInfo)':
                return this.handleAccountsGetInfo()
            case 'pri(accounts.subscribe)':
                return this.accountsSubscribe(id, port);
            default:
                throw new Error(`Unable to handle message of type ${type}`);
        }
    }
}