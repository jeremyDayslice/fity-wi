export type Players = Record<string, Player>;

export type Player = {
	name: string;
	role: Role;
};

export enum Role {
	HOST = 'host',
	GUESSER = 'guesser',
	CHECKER = 'checker',
}

export type Progress = Result[];

export type Result = {
    correct: boolean;
	saved: boolean;
    votes: Record<string, boolean>;
}

export type Question = {
    label: string;
    choices: string[];
}