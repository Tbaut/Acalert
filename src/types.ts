import { WatchInfo } from "./background/State";

type IsNull<T, K extends keyof T> = { [K1 in Exclude<keyof T, K>]: T[K1] } & T[K] extends null ? K : never;

type NullKeys<T> = { [K in keyof T]: IsNull<T, K> }[keyof T];

type KeysWithDefinedValues<T> = {
    [K in keyof T]: T[K] extends undefined ? never : K
}[keyof T];

type NoUndefinedValues<T> = {
    [K in KeysWithDefinedValues<T>]: T[K]
};

export type ResponseType<TMessageType extends keyof RequestSignatures> = RequestSignatures[TMessageType][1];

export interface AccountWatchRequest {
    token1: CollateralType;
    token2: string;
    address: string;
    threshold: number;
}

export interface AccountUpdateRequest {
    accountKey: string;
    token1?: CollateralType;
    token2?: string;
    threshold?: number;
}

export interface AccountDeleteRequest {
    accountKey: string;
}

export type WatchInfoResponse = WatchInfoWithKey[]

export interface WatchInfoWithKey extends WatchInfo {
    key: string;
}

export const collaterals = ["LKSM"] as const
export type CollateralType = typeof collaterals[number]

export interface RequestSignatures {
    // private/internal requests, i.e. from a popup
    'pri(account.watch)': [AccountWatchRequest, boolean];
    "pri(account.delete)": [AccountDeleteRequest, void];
    'pri(account.update)': [AccountUpdateRequest, boolean];
    "pri(accounts.getInfo)": [void, WatchInfoResponse]
    // public/external requests, i.e. from a page
    'pub(phishing.redirectIfDenied)': [null, boolean];
}

export type MessageTypes = keyof RequestSignatures;

// Requests

export type RequestTypes = {
    [MessageType in keyof RequestSignatures]: RequestSignatures[MessageType][0]
};

export type MessageTypesWithNullRequest = NullKeys<RequestTypes>

export interface TransportRequestMessage<TMessageType extends MessageTypes> {
    id: string;
    message: TMessageType;
    origin: string;
    request: RequestTypes[TMessageType];
}

// Responses

export type ResponseTypes = {
    [MessageType in keyof RequestSignatures]: RequestSignatures[MessageType][1]
};

export interface Message extends MessageEvent {
    data: {
        error?: string;
        id: string;
        origin: string;
        response?: string;
        subscription?: string;
    }
}

// Subscriptions

export type SubscriptionMessageTypes = NoUndefinedValues<{
    [MessageType in keyof RequestSignatures]: RequestSignatures[MessageType][2]
}>;

export type MessageTypesWithSubscriptions = keyof SubscriptionMessageTypes;
export type MessageTypesWithNoSubscriptions = Exclude<MessageTypes, keyof SubscriptionMessageTypes>