import { writable } from "svelte/store";
import type {  Writable } from "svelte/store";
import type { Question } from "./questions.types";

const questionsStore: Writable<Question> = writable();

const updateQuestion = (question:Question) => {
    questionsStore.set(question);
}


export default {
    updateQuestion,
    subscribe: questionsStore.subscribe
}
