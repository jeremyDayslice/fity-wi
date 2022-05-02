import { io, Socket } from 'socket.io-client';
const socket: Socket = io('http://localhost:3001', { transports: ['websocket'] });

const joinAsHost = (name: string, code: string) => {
    socket.emit('joinAsHost', { name, code });
};
const joinAsChecker = (name: string, code: string) => {
    socket.emit('joinAsChecker', { name, code: code });
}
const joinAsGuesser = (name: string, code: string) => {
    socket.emit('joinAsGuesser', { name, code: code });
}

export default {
    socket: socket,
    join: {
          joinAsHost,  
          joinAsChecker,
          joinAsGuesser
        }
}