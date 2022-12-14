import { AccountDeleteRequest, AccountUpdateRequest, AccountWatchRequest, MessageTypes, RequestTypes, ResponseType } from "~/types";
import State from "./State";
import browser from "webextension-polyfill";
import { ApiPromise } from "@polkadot/api";
import { createSubscription, unsubscribe } from "./subscriptions";

export default class Extension {
    readonly #state: State;

    constructor(state: State) {
        this.#state = state;
    }

    private accountsSubscribe(id: string, port: browser.Runtime.Port): boolean {
        const cb = createSubscription<'pri(accounts.subscribe)'>(id, port);

        const subscription = this.#state.watchListSubscriber.subscribe((w): void =>
            cb(w)
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

    public async handle<TMessageType extends MessageTypes>(id: string, type: TMessageType, request: RequestTypes[TMessageType], port: browser.Runtime.Port, api: ApiPromise): Promise<ResponseType<TMessageType>> {

        switch (type) {
            case 'pri(account.watch)':
                return this.handleAddWatchingAccount(request as AccountWatchRequest)
            case 'pri(account.update)':
                return this.handleUpdateAccount(request as AccountUpdateRequest)
            case 'pri(account.delete)':
                return this.handleDeleteWatchingAccount(request as AccountDeleteRequest)
            case 'pri(accounts.subscribe)':
                return this.accountsSubscribe(id, port);
            default:
                throw new Error(`Unable to handle message of type ${type}`);
        }
    }
}