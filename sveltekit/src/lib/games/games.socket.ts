import { socket } from "$lib/socket.service";

const joinAsHost = (id: string, name: string, code: string) => {
    socket.emit('joinAsHost', { id, name, code });
};
const joinAsChecker = (id:string, name: string, code: string) => {
    socket.emit('joinAsChecker', { id, name, code });
}
const joinAsGuesser = (id:string, name: string, code: string) => {
    socket.emit('joinAsGuesser', { id, name, code });
}

export default {
    join: {
          joinAsHost,  
          joinAsChecker,
          joinAsGuesser
        }
}