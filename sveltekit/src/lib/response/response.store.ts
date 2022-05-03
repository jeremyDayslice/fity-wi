import { writable } from "svelte/store";
import type {  Writable } from "svelte/store";
import type { Response } from "./response.types";

const responseStore: Writable<Response> = writable();

const updateResponse = (response:Response) => {
    responseStore.set(response);
}


export default {
    updateResponse,
    subscribe: responseStore.subscribe
}
