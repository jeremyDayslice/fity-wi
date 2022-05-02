
import { GamesGateway } from './games/games.gateway';
import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamesModule } from './games/games.module';

@Module({
  imports: [GamesModule, CacheModule.register({ttl: 1000000, isGlobal: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
