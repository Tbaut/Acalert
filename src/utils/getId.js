import { EXTENSION_PREFIX } from "~/constants";
let counter = 0;
export function getId() {
    return `${EXTENSION_PREFIX}.${Date.now()}.${++counter}`;
}
