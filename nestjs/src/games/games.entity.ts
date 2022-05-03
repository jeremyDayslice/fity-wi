import { Players, Progress, Question, Result } from "./games.types";

export interface GamesEntity {
  code: string;
  progress: Progress;
  players?: Players;
  current?: {
    question: Question;
    answer: string;
    result: Result;
  }
}
