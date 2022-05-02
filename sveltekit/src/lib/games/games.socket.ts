import { socket } from "$lib/socket.service";

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
    join: {
          joinAsHost,  
          joinAsChecker,
          joinAsGuesser
        }
}