import {  writable } from "svelte/store";
import type {Writable} from "svelte/store";
import { createGame, findGame } from "./games.api";
import gamesSocket from "./games.socket";
import type { Player } from "./games.types";
import { Roles } from "./games.types";

const gameCode: Writable<string> = writable();
const role: Writable<Roles> = writable();
const player: Writable<Player> = writable();

const makePlayer = (name:string) => {
    const id: string = Math.random().toString(36).substring(2,10);
    const newPlayer: Player = {
        id,
        name
    };
    debugger;
    localStorage.setItem('player', JSON.stringify(newPlayer));
    player.set(newPlayer);
}

const loadPlayer= async () => {
    const playerString = localStorage.getItem('player');
    if(!playerString) {
        return null;
    }
    await player.set(JSON.parse(playerString));
    return player;
}

export const playerStore = {
    subscribe: player.subscribe,
    makePlayer: makePlayer,
    loadPlayer: loadPlayer

}

const hostGame = async (id: string, name: string) => {
    const game = await createGame(id, name); 
    gameCode.set(game.code);
    role.set(Roles.HOST);
    gamesSocket.join.joinAsHost(id, name, game.code);
}

const joinGameAsGuesser = async (id: string, name: string, code: string) => {
    const game = await findGame(code);
    if(game) {
        gameCode.set(game.code);
        gamesSocket.join.joinAsGuesser(id, name, game.code);
        role.set(Roles.GUESSER);
    }
} 

const joinGameAsChecker = async (id: string, name: string, code: string) => {
    const game = await findGame(code);
    debugger
    if(game) {
        gameCode.set(game.code);
        gamesSocket.join.joinAsChecker(id, name, game.code);
        role.set(Roles.CHECKER);
    }
} 

const rejoinGame = async (id: string, name:string, code: string) => {
    const game = await findGame(code);
    if(!game || !game.players[id]) {
        return null;
    }
    role.set(game.players[id].role);

    switch (game.players[id].role) {
        case Roles.HOST:
            gamesSocket.join.joinAsHost(id, name, code);
            break;
        case Roles.CHECKER:
            gamesSocket.join.joinAsChecker(id, name, code);
            break;
        case Roles.GUESSER:
            gamesSocket.join.joinAsGuesser(id, name, code);
        default:
            break;
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
        rejoinGame,
}