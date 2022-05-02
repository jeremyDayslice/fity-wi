import { Writable, writable } from "svelte/store";
import { createGame, findGame } from "./games.api";
import gamesSocket from "./games.socket";
import { Roles } from "./games.types";

const gameCode: Writable<string> = writable();
const role: Writable<Roles> = writable();

const hostGame = async (name: string) => {
    const game = await createGame(name); 
    gameCode.set(game.code);
    gamesSocket.join.joinAsHost(name, game.code);
}

const joinGameAsGuesser = async (name: string, code: string) => {
    const game = await findGame(code);
    if(game) {
        gameCode.set(game.code);
        gamesSocket.join.joinAsGuesser(name, game.code);
        role.set(Roles.GUESSER);
    }
} 

const joinGameAsChecker = async (name: string, code: string) => {
    const game = await findGame(code);
    if(game) {
        gameCode.set(game.code);
        gamesSocket.join.joinAsChecker(name, game.code);
        role.set(Roles.CHECKER);
    }
} 

const leaveGame = () => {
    gameCode.set('');
}

export const roleStore = {
    subscribe: role.subscribe
}

export const codeStore = {
    subscribe: gameCode.subscribe
}

export const join = {
        joinGameAsChecker,
        joinGameAsGuesser,
        leaveGame,
        hostGame,
}