/* https://docs.nestjs.com/providers#services */ 
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { GamesEntity } from './games.entity';
import * as randomString from 'randomstring';
import { QuestionsService } from './questions.service';
import { FileService } from 'src/file.service';
import { Role } from './games.types';

@Injectable()

export class GamesService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private questionsService: QuestionsService, private fileService: FileService) {}

    public newGame(name: string, id: string): GamesEntity {
        const game = {
            code: randomString.generate(4),
            progress: [],
            players: {}
        }
        game.players[id] = {
                    name: name,
                    role: Role.HOST,
                }
        return game;
    }

    public async getGame(code: string): Promise<GamesEntity> {
        let game: GamesEntity = await this.cacheManager.get<GamesEntity>(code);
        if(!game) {
            game = this.fileService.readFileToObj(code, '.');
            this.cacheManager.set(code, game);
        }
        return game;
    }

    public saveGame(game: GamesEntity) {
        this.fileService.saveObjToJson(game, game.code, '.');
        return this.cacheManager.set(game.code, game);
    }

    public async addChecker(id: string, name: string, code: string): Promise<GamesEntity> {
        return this.addUserWithRole(id, name, Role.CHECKER, code);
    }
    
    public async addGuesser(id: string, name: string, code: string): Promise<GamesEntity> {
        return this.addUserWithRole(id, name, Role.GUESSER, code);
    }

    public async addHost(id: string, name: string, code: string): Promise<GamesEntity> {
        return this.addUserWithRole(id, name, Role.HOST, code);
    }

    public async addUserWithRole(id: string, name: string, role: Role, code: string): Promise<GamesEntity> {
        const game = await this.getGame(code);
        if(game.players[id]) {
            return game;
        }
        game.players[id] = {
            name: name,
            role: role
        };
        await this.saveGame(game);
        return game;
    }


    public async nextQuestion(game: GamesEntity): Promise<GamesEntity> {
        const question = await this.questionsService.getQuestion();
        game.current = {
            question: { 
                label: question.label,
                choices: question.choices,
            },
            answer: question.answer,
            result: {
                correct: null,
                saved: null,
                votes: {}
            }
        }
        this.saveGame(game);
        return game;
    }
}
