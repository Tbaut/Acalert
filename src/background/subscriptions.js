const subscriptions = {};
// return a subscription callback, that will send the data to the caller via the port
export function createSubscription(id, port) {
    subscriptions[id] = port;
    return (subscription) => {
        if (subscriptions[id]) {
            port.postMessage({ id, subscription });
        }
    };
}
// clear a previous subscriber
export function unsubscribe(id) {
    if (subscriptions[id]) {
        console.log(`Unsubscribing from ${id}`);
        delete subscriptions[id];
    }
    else {
        console.error(`Unable to unsubscribe from ${id}`);
    }
}
