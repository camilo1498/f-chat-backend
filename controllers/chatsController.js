const Chat = require('../models/chat');

module.exports = {

    async create(req, res, next) {
        try {
            const chat = req.body;

            const existChat = await Chat.findByUser1AndUser2(chat.id_user1, chat.id_user2);

            if (existChat) {
                console.log('ACTUALIZAR CHAT');
                await Chat.update(chat);
                return res.status(201).json({
                    message: 'The chat has been created successfully',
                    success: true,
                    data: existChat.id
                });
            }
            else {
                console.log('SE CREO CHAT');
                const data = await Chat.create(chat);

                return res.status(201).json({
                    message: 'The chat has been created successfully',
                    success: true,
                    data: data.id
                });
            }
        
        } catch (error) {
            console.log(error);
            return res.status(501).json({
                message: 'The chat could not be created',
                success: false,
                error: error
            });
        }
    },

    async findByUser(req, res, next) {
        try {
            
            const id_user = req.params.id_user;
            const data = await Chat.findByIdUser(id_user);
            return res.status(201).json(data);

        } 
        catch (error) {
            console.log(error);
            return res.status(501).json({
                message: 'Chats could not be listed',
                success: false,
                error: error
            });
        }
    }

}