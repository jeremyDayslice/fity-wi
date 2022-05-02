import type { Game } from "./games.types";

function findGame(code: string): Promise<Game> {
	return fetch(`http://localhost:3001/games/${code}`, {
		method: 'GET',
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((r) => r.json());
}

function createGame(name: string): Promise<Game> {
	return fetch(`http://localhost:3001/games`, {
		method: 'POST',
        body: JSON.stringify({
            name: name
            }),
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((r) => r.json());
}

export {
    createGame,
    findGame,
}