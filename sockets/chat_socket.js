const User = require('../models/user');

module.exports = (io) => {

    const chatNSP = io.of('/chat');
    chatNSP.on('connection', function(socket) {

        console.log('user connected to socket io', socket.id);

        socket.on('message', function(data) {
            console.log('New message', data);
            chatNSP.emit(`message/${data.id_chat}`, data);
            chatNSP.emit(`message/${data.id_user}`, data);
        });

        socket.on('writing', function(data) {
            console.log('User typing', data);
            chatNSP.emit(`writing/${data.id_chat}/${data.id_user}`, data);
        });
        
        socket.on('seen', function(data) {
            console.log('Seen message', data);
            chatNSP.emit(`seen/${data.id_chat}`, data);
        });

        socket.on('online', async function(data) {

            chatNSP.emit(`online/${data.id_user}`, { id_socket: socket.id });
            await User.updateOnlineByUser(data.id_user, true);
            await User.updateIdSocket(data.id_user, socket.id);
            console.log('A new user connected to the chat', socket.id);

        });

        socket.on('disconnect', async function(data) {
            console.log('Disconnected user', socket.id);
            chatNSP.emit(`offline/${socket.id}`, { id_socket: socket.id });
            await User.updateOnlineBySocket(socket.id, false);
        });

    });

}