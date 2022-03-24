const User = require('../models/user');

module.exports = (io) => {

    const chatNSP = io.of('/chat');
    chatNSP.on('connection', function(socket) {

        console.log('USUARIO SE CONECTO A SOCKET IO', socket.id);

        socket.on('message', function(data) {
            console.log('Nuevo mensaje', data);
            chatNSP.emit(`message/${data.id_chat}`, data);
            chatNSP.emit(`message/${data.id_user}`, data);
        });

        socket.on('writing', function(data) {
            console.log('Usuario escribiendo', data);
            chatNSP.emit(`writing/${data.id_chat}/${data.id_user}`, data);
        });
        
        socket.on('seen', function(data) {
            console.log('Mensaje visto', data);
            chatNSP.emit(`seen/${data.id_chat}`, data);
        });

        socket.on('online', async function(data) {

            chatNSP.emit(`online/${data.id_user}`, { id_socket: socket.id });
            await User.updateOnlineByUser(data.id_user, true);
            await User.updateIdSocket(data.id_user, socket.id);
            console.log('UN NUEVO USUARIO SE CONECTO AL CHAT', socket.id);

        });

        socket.on('disconnect', async function(data) {
            console.log('UN USUARIO SE DESCONECTO', socket.id);
            chatNSP.emit(`offline/${socket.id}`, { id_socket: socket.id });
            await User.updateOnlineBySocket(socket.id, false);
        });

    });

}