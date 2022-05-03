/*
https://docs.nestjs.com/websockets/gateways#gateways
*/

import { IoAdapter } from '@nestjs/platform-socket.io';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GamesEntity } from './games.entity';
import { GamesService } from './games.service';
import { Role } from './games.types';
@WebSocketGateway({ transports: ['websocket'] })
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

    constructor(private service: GamesService) {}

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('joinAsHost')
    async joinAsHost(client: Socket, data: {id: string, code: string}) {
        const game: GamesEntity = await this.service.getGame(data.code);
        if(game.players[data.id] && game.players[data.id].role == Role.HOST) {
            client.join(data.code);
            client.join(`${data.code}-host`);
            client.leave(`${data.code}-guesser`);
            this.server.to(data.code).emit('updated', game);
            console.log(`${data.id} has joined as Host of ${data.code}`);
        }
    }

    @SubscribeMessage('joinAsChecker')
    async joinAsChecker(client: Socket, data: {id: string, name: string, code: string}) {
        const game: GamesEntity = await this.service.addChecker(data.id, data.name, data.code);
        client.join(data.code);
        client.leave(`${data.code}-guesser`);
        client.leave(`${data.code}-host`);
        this.server.to(data.code).emit('updated', game);
        this.server.to(`${data.code}-host`).emit('host-updated', game);
    }
    
    @SubscribeMessage('joinAsGuesser')
    async joinAsGuesser(client: Socket, data: {id: string, name: string, code: string}) {
        const game: GamesEntity = await this.service.addGuesser(data.id, data.name, data.code);
        client.join(data.code);
        client.join(`${data.code}-guesser`);
        client.leave(`${data.code}-host`);
        this.server.to(data.code).emit('updated', game);
    }

    @SubscribeMessage('nextQuestion')
    async getNextQuestion(client: Socket, data:{code: string}) {
        let game: GamesEntity = await this.service.getGame(data.code); 
        game = await this.service.nextQuestion(game);
        this.server.to(data.code).emit('newQuestion', { question: game.current.question.label, choices: game.current.question.choices });
        
        this.server.to(`${data.code}-host`).emit('newAnswer', { answer: game.current.answer })
    }

    @SubscribeMessage('makeGuess')
    async checkGuess(client: Socket, data:{code: string, guess: string}) {
        const game: GamesEntity = await this.service.getGame(data.code); 
        debugger;
        this.server.to(data.code).emit('guessMade', data.guess);
        this.server.to(`${data.code}-guesser`).emit('guessResult', { answer: game.current.answer, guess: data.guess });
        this.server.to(`${data.code}-host`).emit('guessResult', { answer: game.current.answer, guess: data.guess });
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
