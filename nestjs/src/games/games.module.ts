import { Module } from '@nestjs/common';
import { FileService } from 'src/file.service';
import { GamesController } from './games.controller';
import { GamesGateway } from './games.gateway';
import { GamesService } from './games.service';
import { QuestionsService } from './questions.service';

@Module({
  imports: [],
  controllers: [GamesController],
  providers: [GamesService, GamesGateway, QuestionsService, FileService],
  exports: [GamesService]
})
export class GamesModule {}
