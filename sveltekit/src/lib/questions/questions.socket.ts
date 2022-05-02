import { socket } from "$lib/socket.service";
import questionsStore from "./questions.store";
import type { Question } from "./questions.types";

const newQuestion = (code: string) => {
    socket.emit('nextQuestion', { code });
    debugger;
};

socket.on('newQuestion', (question:Question) => {
    debugger;
    questionsStore.updateQuestion(question);
    debugger;
});

const makeGuess = (code: string, guess: string) => {
    socket.emit('makeGuess', {code, guess});
}

const listenForGuess = (code: string) => {
    socket.on('guessMade', (choice: string) => {
        console.log('a guess was made! ', choice)
    })
}

const listenForGuessResult = (code: string) => {
    socket.on('guessResult', (choice: string, answer: string) => {
        console.log('the answer was ', answer);
    })
}

export default {
    question: {
        newQuestion,
        makeGuess,
        listenForGuess,
        listenForGuessResult
    }
}