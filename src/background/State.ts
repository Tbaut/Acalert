import { ApiPromise } from "@polkadot/api";
import { encodeAddress } from "@polkadot/util-crypto";
import { AccountDeleteRequest, AccountUpdateRequest, CollateralType } from "~/types";

const PRECISION = Math.pow(10, 6)
const KARURA_PREFIX = 8
const STORAGE_PREFIX = 42
const STORAGE_KEY_WATCHLIST = "Acalert_watchlist_v1"

export interface WatchInfo {
    address: string
    token1: CollateralType;
    token2: string;
    ratio: number;
    threshold: number;
}

export default class State {
    readonly #api: ApiPromise;
    watchlist: Record<string, WatchInfo> = {}
    isAlertOn = false;

    constructor(api: ApiPromise) {
        this.#api = api;
        this.watchlist = this.getWatchListFromStorage();
        this.listenToNewBlocks();
    }

    private async listenToNewBlocks() {
        await this.#api.isReady;
        await this.#api.rpc.chain.subscribeNewHeads(async (header) => {
            Object.values(this.watchlist).forEach((account) => {
                const { address, token1, token2 } = account
                this.calculateRatio(token1, token2, encodeAddress(address, KARURA_PREFIX))
            })
            this.updateAlarm();
        });
    }

    public updateAlarm = () => {
        const shouldHaveAlarmOn = Object.values(this.watchlist).some((account) => this.isRatioBelowThreshold(account))

        if (shouldHaveAlarmOn && !this.isAlertOn) {
            this.turnAlarmOn()
        }

        if (!shouldHaveAlarmOn && this.isAlertOn) {
            this.turnAlarmOff()
        }
    }

    private turnAlarmOn = () => {
        browser.browserAction.setIcon({ path: "/assets/RedDot.svg" })
        this.isAlertOn = true
    }

    private turnAlarmOff = () => {
        browser.browserAction.setIcon({ path: "/assets/GreenDot.svg" })
        this.isAlertOn = false
    }

    private isRatioBelowThreshold(account: WatchInfo) {
        return account.ratio !== -1 && account.ratio < account.threshold
    }
    public getAccountKey(address: string, token1: string) {
        return `${encodeAddress(address, STORAGE_PREFIX)}_${token1}`
    }

    private async calculateRatio(token1: string, token2: string, address: string) {
        const { collateral, debit } = (await this.#api.query.loans.positions({ "Token": token1 }, address)).toJSON() as { collateral: string, debit: string }
        const debitExchangerate = (await this.#api.query.cdpEngine.debitExchangeRate({ "Token": token1 })).toString()
        // console.log('coll', BigInt(collateral))
        // console.log('debit', BigInt(debit))
        // console.log('debitExhangerate', debitExchangerate)
        const totalDebit = BigInt(debit) * BigInt(debitExchangerate)
        // console.log('totalDebit', totalDebit)

        // bail early to prevent division by 0 in case there's no debit.
        if (totalDebit === 0n) return

        // (homa.totalStakingBonded + homa.toBondPool) / (tokens.totalIssuance[LKSM] + homa.totalVoidLiquid)
        const totalStakingBonded = (await this.#api.query.homa.totalStakingBonded()).toString()
        const toBondPool = (await this.#api.query.homa.toBondPool()).toString()
        const totalIssuance = (await this.#api.query.tokens.totalIssuance({ "Token": token1 })).toString()
        const totalVoidLiquidity = (await this.#api.query.homa.totalVoidLiquid()).toString()
        const ratioToKsm = (BigInt(totalStakingBonded) + BigInt(toBondPool)) * BigInt(PRECISION) / (BigInt(totalIssuance) + BigInt(totalVoidLiquidity))
        // console.log('ratioToKsm', ratioToKsm)
        // @ts-ignore
        const ksmPrice = (await this.#api.query.acalaOracle.values({ "Token": token2 })).toJSON()?.value
        // console.log('ksmPrice', BigInt(ksmPrice))

        const equivalentKsm = BigInt(collateral) * ratioToKsm
        // console.log('equivalentKsm', equivalentKsm)
        const colInUSD = BigInt(equivalentKsm) * BigInt(ksmPrice)
        // console.log('colInUSD', colInUSD)
        const colRatioBn = colInUSD / totalDebit
        console.log('ratio address', Number(colRatioBn) / 10000, address)
        const accountKey = this.getAccountKey(address, token1)
        this.setRatio(accountKey, Number(colRatioBn) / 10000)
    }

    public getRatio(accountKey: string) {
        return this.watchlist[accountKey].ratio
    }

    private setRatio(accountId: string, ratio: number) {
        this.watchlist[accountId].ratio = ratio
    }

    public addWatchingAddress(address: string, token1: CollateralType, token2: string, threshold: number) {
        const accountKey = this.getAccountKey(address, token1)
        this.watchlist[accountKey] = {
            address,
            token1,
            token2,
            ratio: -1,
            threshold
        }

        this.storeWatchList()
        this.updateAlarm()
        return true
    }

    public updateAccount({ accountKey, threshold, token1, token2 }: AccountUpdateRequest) {
        const account = this.watchlist[accountKey]

        if (!account) {
            throw new Error(`No account found to update with this key, got ${accountKey}`)
        }

        this.watchlist[accountKey] = {
            ...account,
            threshold: threshold || account.threshold,
            token1: token1 || account.token1,
            token2: token2 || account.token2
        }

        this.storeWatchList()
        this.updateAlarm()
        return true
    }

    private storeWatchList() {
        localStorage.setItem(STORAGE_KEY_WATCHLIST, JSON.stringify(this.watchlist))
    }

    private getWatchListFromStorage() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_WATCHLIST) || "{}")
    }

    public deleteWatchingAddress({ accountKey }: AccountDeleteRequest) {
        if (!this.watchlist[accountKey]) {
            throw new Error(`No account found to delete with this key, got ${accountKey}`)
        }

        delete this.watchlist[accountKey]
        this.storeWatchList()
        this.updateAlarm()
    }
}