import { CACHE_MANAGER, Controller, Inject, Post, Body, Get, Param } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { GamesEntity } from './games.entity';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
	constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private service: GamesService) {}

	@Post()
	async createGame(@Body() body: { name: string }): Promise<GamesEntity> {
		const game = this.service.newGame(body.name);
		await this.cacheManager.set(game.code, game, { ttl: 0});
		return game;
	}

	@Get(':code')
	async getGame(@Param('code') code: string): Promise<GamesEntity> {
		const game: GamesEntity = await this.service.getGame(code);
		if(!game) {
			return null;
		}
		return game;
	}
}
