import { EXTENSION_PREFIX } from "~/constants";

let counter = 0;

export function getId(): string {
    return `${EXTENSION_PREFIX}.${Date.now()}.${++counter}`;
}