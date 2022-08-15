import { WatchList } from "~/background/State";
import { PORT_EXTENSION } from "~/constants";
import { AccountDeleteRequest, AccountUpdateRequest, AccountWatchRequest, Message, MessageTypes, MessageTypesWithNoSubscriptions, MessageTypesWithNullRequest, MessageTypesWithSubscriptions, RequestTypes, ResponseTypes, SubscriptionMessageTypes, WatchInfoResponse } from "~/types";
import { getId } from "~/utils/getId";

interface Handler {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolve: (data: any) => void;
    reject: (error: Error) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subscriber?: (data: any) => void;
}

type Handlers = Record<string, Handler>;

const port = browser.runtime.connect({ name: PORT_EXTENSION });
const handlers: Handlers = {};

// setup a listener for messages, any incoming resolves the promise
port.onMessage.addListener((data: Message['data']): void => {
    const handler = handlers[data.id];

    if (!handler) {
        console.error(`Unknown response: ${JSON.stringify(data)}`);

        return;
    }

    if (!handler.subscriber) {
        delete handlers[data.id];
    }

    if (data.subscription) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        (handler.subscriber as Function)(data.subscription);
    } else if (data.error) {
        handler.reject(new Error(data.error));
    } else {
        handler.resolve(data.response);
    }
});

function sendMessage<TMessageType extends MessageTypesWithNullRequest>(message: TMessageType): Promise<ResponseTypes[TMessageType]>;
function sendMessage<TMessageType extends MessageTypesWithNoSubscriptions>(message: TMessageType, request: RequestTypes[TMessageType]): Promise<ResponseTypes[TMessageType]>;
function sendMessage<TMessageType extends MessageTypesWithSubscriptions>(message: TMessageType, request: RequestTypes[TMessageType], subscriber: (data: SubscriptionMessageTypes[TMessageType]) => void): Promise<ResponseTypes[TMessageType]>;
function sendMessage<TMessageType extends MessageTypes>(message: TMessageType, request?: RequestTypes[TMessageType], subscriber?: (data: unknown) => void): Promise<ResponseTypes[TMessageType]> {
    return new Promise((resolve, reject): void => {
        const id = getId();

        handlers[id] = { reject, resolve, subscriber };

        port.postMessage({ id, message, request: request || {} });
    });
}

export async function watchAccount(request: AccountWatchRequest): Promise<boolean> {
    return sendMessage('pri(account.watch)', request);
}

export async function deleteAccount(request: AccountDeleteRequest): Promise<void> {
    return sendMessage('pri(account.delete)', request);
}

export async function updateAccount(request: AccountUpdateRequest): Promise<boolean> {
    return sendMessage('pri(account.update)', request);
}

export async function getAccountsInfo(): Promise<WatchInfoResponse> {
    return sendMessage('pri(accounts.getInfo)', undefined);
}

export async function subscribeAccounts(cb: (accounts: WatchList) => void): Promise<boolean> {
    return sendMessage('pri(accounts.subscribe)', null, cb);
}