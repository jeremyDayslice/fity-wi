export enum Roles {
    HOST = 'host',
    CHECKER = 'checker',
    GUESSER = 'guesser'
}

export type Question = {
    question: string;
    choices: string[];
}