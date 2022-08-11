export default class Tabs {
    // readonly #accountSubs: Record<string, AccountSub> = {};
    #state;
    constructor(state) {
        this.#state = state;
    }
    async handle(id, type, request, url, port, api) {
        if (type === 'pub(phishing.redirectIfDenied)') {
            return true;
        }
        console.log(2);
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
