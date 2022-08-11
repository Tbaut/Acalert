import { PORT_EXTENSION } from "~/constants";
import { getId } from "~/utils/getId";
const port = browser.runtime.connect({ name: PORT_EXTENSION });
const handlers = {};
// setup a listener for messages, any incoming resolves the promise
port.onMessage.addListener((data) => {
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
        handler.subscriber(data.subscription);
    }
    else if (data.error) {
        handler.reject(new Error(data.error));
    }
    else {
        handler.resolve(data.response);
    }
});
function sendMessage(message, request, subscriber) {
    return new Promise((resolve, reject) => {
        const id = getId();
        handlers[id] = { reject, resolve, subscriber };
        port.postMessage({ id, message, request: request || {} });
    });
}
export async function watchAccount(request) {
    return sendMessage('pri(account.watch)', request);
}
export async function deleteAccount(request) {
    return sendMessage('pri(account.delete)', request);
}
export async function updateAccount(request) {
    return sendMessage('pri(account.update)', request);
}
export async function getAccountsInfo() {
    return sendMessage('pri(accounts.getInfo)', undefined);
}
