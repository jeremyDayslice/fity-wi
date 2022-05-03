import responseStore from "$lib/response/response.store";
import type { Response } from "$lib/response/response.types";
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
    console.log(code, guess);
    socket.emit('makeGuess', {code, guess});
}

const listenForGuess = (code: string) => {
    socket.on('guessMade', (response: Response) => {
        responseStore.updateResponse(response);
        console.log('the guess is ', response);
    })
}

const listenForGuessResult = (code: string) => {
    socket.on('guessResult', (response: Response) => {
        responseStore.updateResponse(response);
        console.log('the guess and answer are ', response);
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