export enum Roles {
    HOST = 'host',
    CHECKER = 'checker',
    GUESSER = 'guesser'
}

export type Game = {
    code: string;
    players: any;
}

export type Player = {
    id: string,
    name: string
}