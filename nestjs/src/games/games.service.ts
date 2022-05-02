/* https://docs.nestjs.com/providers#services */ 
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { GamesEntity } from './games.entity';
import * as randomString from 'randomstring';
import { QuestionsService } from './questions.service';

@Injectable()

export class GamesService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private questionsService: QuestionsService) {}

    public newGame(name: string): GamesEntity {
           return {
            code: randomString.generate(4),
            player: name,
            checkers: [],
            progress: 0
        }
    }

    public getGame(code: string): Promise<GamesEntity> {
        return this.cacheManager.get<GamesEntity>(code);
    }

    public async addChecker(name: string, code: string): Promise<GamesEntity> {
        const game = await <Promise<GamesEntity>>this.cacheManager.get(code);
        game.checkers.push(name);
        await this.cacheManager.set(code, game);
        return game;
    }

    public async nextQuestion(game: GamesEntity): Promise<GamesEntity> {
        const question = await this.questionsService.getQuestion();
        game.current = {
            question: question.question,
            choices: question.choices,
            answer: question.answer,
            votes: []
        }
        this.cacheManager.set(game.code, game);
        return game;
    }
}
