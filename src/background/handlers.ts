import Extension from './Extension';
import State from './State';
import Tabs from './Tabs';
import browser from "webextension-polyfill";

import { MessageTypes, TransportRequestMessage } from "~/types";
import { ApiPromise } from '@polkadot/api';
import { PORT_EXTENSION } from '~/constants';

// const state = new State();
// const extension = new Extension(state, api);
// const tabs = new Tabs(state);

export default function handler<TMessageType extends MessageTypes>({ id, message, request }: TransportRequestMessage<TMessageType>, port: browser.Runtime.Port, extensionPortName = PORT_EXTENSION, api: ApiPromise, state: State, extension: Extension, tabs: Tabs): void {
    const isExtension = port.name === extensionPortName;
    const sender = port.sender as browser.Runtime.MessageSender;
    const from = isExtension
        ? 'extension'
        : (sender.tab && sender.tab.url) || sender.url || '<unknown>';
    const source = `${from}: ${id}: ${message}`;

    console.log(` [in] ${source}`); // :: ${JSON.stringify(request)}`);

    const promise = isExtension
        ? extension.handle(id, message, request, port, api)
        : tabs.handle(id, message, request, from, port, api);

    promise
        .then((response): void => {
            console.log(`[out] ${source}`); // :: ${JSON.stringify(response)}`);

            // between the start and the end of the promise, the user may have closed
            // the tab, in which case port will be undefined
            if (!port) {
                throw new Error('Port has been disconnected');
            }

            port.postMessage({ id, response });
        })
        .catch((error: Error): void => {
            console.log(`[err] ${source}:: ${error.message}`);

            // only send message back to port if it's still connected
            if (port) {
                port.postMessage({ error: error.message, id });
            }
        });
}
