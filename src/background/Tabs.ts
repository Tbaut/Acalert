import { MessageTypes, RequestTypes, ResponseTypes } from "~/types";
import State from "./State";
import browser from "webextension-polyfill";
import { ApiPromise } from "@polkadot/api";

export default class Tabs {
    // readonly #accountSubs: Record<string, AccountSub> = {};

    readonly #state: State;

    constructor(state: State) {
        this.#state = state;
    }

    public async handle<TMessageType extends MessageTypes>(id: string, type: TMessageType, request: RequestTypes[TMessageType], url: string, port: browser.Runtime.Port, api: ApiPromise): Promise<ResponseTypes[keyof ResponseTypes]> {
        if (type === 'pub(phishing.redirectIfDenied)') {
            return true;
        }

        console.log(2)
        // if (type !== 'pub(authorize.tab)') {
        //   this.#state.ensureUrlAuthorized(url);
        // }

        switch (type) {
            case 'pub(phishing.redirectIfDenied)':
                return true;

            default:
                throw new Error(`Unable to handle message of type ${type}`);
        }
    }
}