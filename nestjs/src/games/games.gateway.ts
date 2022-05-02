/*
https://docs.nestjs.com/websockets/gateways#gateways
*/

import { IoAdapter } from '@nestjs/platform-socket.io';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GamesEntity } from './games.entity';
import { GamesService } from './games.service';
@WebSocketGateway({ transports: ['websocket'] })
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

    constructor(private service: GamesService) {}

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('joinAsHost')
    async joinAsHost(client: Socket, data: {name: string, code: string}) {
        client.join(data.code);
        client.join(`${data.code}-host`);
        const game: GamesEntity = await this.service.getGame(data.code);
        this.server.to(data.code).emit('updated', game);
    }

    @SubscribeMessage('joinAsChecker')
    async joinAsChecker(client: Socket, data: {name: string, code: string}) {
        const game: GamesEntity = await this.service.addChecker(data.name, data.code);
        client.join(data.code);
        this.server.to(data.code).emit('updated', game);
        this.server.to(`${data.code}-host`).emit('host-updated', game);
    }

    @SubscribeMessage('nextQuestion')
    async getNextQuestion(client: Socket, data:{code: string}) {
        let game: GamesEntity = await this.service.getGame(data.code); 
        game = await this.service.nextQuestion(game);
        this.server.to(data.code).emit('newQuestion', { question: game.current.question, choices: game.current.choices });
        
        this.server.to(`${data.code}-host`).emit('newAnswer', { answer: game.current.answer })
    }

    @SubscribeMessage('makeGuess')
    async checkGuess(client: Socket, data:{code: string, guess: string}) {
        const game: GamesEntity = await this.service.getGame(data.code); 
        this.server.to(data.code).emit('guessMade');
        this.server.to(`${data.code}-guesser`).emit('guessResult', { answer: game.current.answer, guess: data.guess });
    }

    handleConnection(client: any, ...args: any[]) {
        console.log('User connected');
    }

    handleDisconnect(client: any) {
        console.log('User disconnected');
    }

    afterInit(server: any) {
        console.log('Socket is live')
    }
}
