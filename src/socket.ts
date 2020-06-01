import io from 'socket.io'

export const socketServer = io()
socketServer.on('connection', (socket) => {
})
