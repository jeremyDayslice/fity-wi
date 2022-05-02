export interface GamesEntity {
  code: string;
  player: any;
  checkers: any[];
  progress: number;
  current?: {
    question: string;
    choices: string[];
    answer: number;
    votes: boolean[];
  },
  
}
