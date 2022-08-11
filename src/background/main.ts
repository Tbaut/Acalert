import { sendMessage } from "webext-bridge";
import browser from "webextension-polyfill";
import { RequestSignatures, TransportRequestMessage } from "~/types";
import handlers from "./handlers";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { options } from "@acala-network/api";
import State from "./State";
import Extension from "./Extension";
import Tabs from "./Tabs";
import { PORT_CONTENT, PORT_EXTENSION } from "~/constants";
// const WS_PROVIDER = "wss://karura-rpc-1.aca-api.network"
// const provider = new WsProvider(WS_PROVIDER)

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import("/@vite/client");
  // load latest content script
  import("./contentScriptHMR");
}

// export const EXTENSION_PREFIX = process?.env.EXTENSION_PREFIX as string || '';

// let previousTabId = 0;

// // communication example: send previous tab title from background page
// // see shim.d.ts for type declaration
// browser.tabs.onActivated.addListener(async ({ tabId }) => {
//   if (!previousTabId) {
//     previousTabId = tabId;
//     return;
//   }

//   let tab: Tabs.Tab;

//   try {
//     tab = await browser.tabs.get(previousTabId);
//     previousTabId = tabId;
//   } catch {
//     return;
//   }

//   // eslint-disable-next-line no-console
//   console.log("previous tab", tab);
//   sendMessage(
//     "tab-prev",
//     { title: tab.title },
//     { context: "content-script", tabId }
//   );
// });

// const apiRX = new ApiRx({ provider })
// const apiPromise = new ApiPromise({ provider })
// let unsubscribe: VoidFn | undefined

// const loan = new LoanRx(apiRX, "LKSM", "pkN6ZV3ipp3gWyS9WPzU9KXc85fQKmfoALgL3GZ5iykRFDA", "pkN6ZV3ipp3gWyS9WPzU9KXc85fQKmfoALgL3GZ5iykRFDA")
// apiPromise.isReady
//   .then(async () => {
//     let count = 0;

//     unsubscribe = await apiPromise.rpc.chain.subscribeNewHeads((header) => {
//       console.log(`Chain is at block: #${header.number}`);
//       count % 2 === 1
//         ? browser.browserAction.setIcon({ path: "/assets/GreenDot.svg" })
//         : browser.browserAction.setIcon({ path: "/assets/RedDot.svg" })
//         ;

//       if (++count === 256) {
//         unsubscribe && unsubscribe();
//         process.exit(0);
//       }
//     });
//   })
//   .catch(e => console.error(e))


const provider = new WsProvider("wss://karura-rpc-1.aca-api.network");
const api = new ApiPromise(options({ provider }));


const state = new State(api);
const extension = new Extension(state);
const tabs = new Tabs(state);

// listen to all messages and handle appropriately
browser.runtime.onConnect.addListener(async (port): Promise<void> => {
  // shouldn't happen, however... only listen to what we know about
  if (![PORT_CONTENT, PORT_EXTENSION].includes(port.name)) {
    console.error(`Unknown connection from ${port.name}`)
    return
  }

  port.onMessage.addListener((data: TransportRequestMessage<keyof RequestSignatures>) => handlers(data, port, undefined, api, state, extension, tabs));

  port.onDisconnect.addListener(() => {
    console.log(`Disconnected from ${port.name}`)
  });
});

// initial setup

// onMessage("get-current-tab", async () => {
//   try {
//     const tab = await browser.tabs.get(previousTabId);
//     return {
//       title: tab?.id,
//     };
//   } catch {
//     return {
//       title: undefined,
//     };
//   }
// });
