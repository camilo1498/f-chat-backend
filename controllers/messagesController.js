const Message = require('../models/message');
const storage = require('../utils/cloud_storage');
const videoStorage = require('../utils/cloud_storage_video');

module.exports = {

    async create(req, res, next) {
        try {
            const message = req.body;
            const data = await Message.create(message);

            return res.status(201).json({
                message: 'The message has been created successfully',
                success: true,
                data: data.id
            });
        
        } catch (error) {
            console.log(error);
            return res.status(501).json({
                message: 'The message could not be created',
                success: false,
                error: error
            });
        }
    },

    async findByChat(req, res, next) {
        try {
            const id_chat = req.params.id_chat;
            const data = await Message.findByChat(id_chat);

            return res.status(201).json(data);
        
        } catch (error) {
            console.log(error);
            return res.status(501).json({
                message: 'Could not read messages',
                success: false,
                error: error
            });
        }
    },

    async createWithImage(req, res, next) {
        try {
            
            const message = JSON.parse(req.body.message);
            console.log(`User Submitted Data: ${message}`);

            const files = req.files;

            if (files.length > 0) {
                const pathImage = `image_${Date.now()}`; // NOMBRE DEL ARCHIVO
                const url = await storage(files[0], pathImage);

                if (url != undefined && url != null) {
                    message.url = url;
                }
            }

            const data = await Message.create(message);
            
            return res.status(201).json({
                success: true,
                message: 'The message has been created successfully',
                data: {
                    'id': data.id,
                    'url': message.url
                }
            });

        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'There was an error with the user registration',
                error: error
            });
        }
    },

    async createWithVideo(req, res, next) {
        try {
            
            const message = JSON.parse(req.body.message);
            
            if (req.file) {
                const path = `video_${Date.now()}`; // NOMBRE DEL ARCHIVO
                const url = await videoStorage(req.file, path);

                if (url != undefined && url != null) {
                    message.url = url;
                }

                const data = await Message.create(message);
            
                return res.status(201).json({
                    success: true,
                    message: 'The message has been created successfully',
                    data: data.id
                });
            }
            else {
                return res.status(501).json({
                    success: false,
                    message: 'The video could not be saved'
                });
            }
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'There was an error creating a new video message',
                error: error
            });
        }
    },

    async updateToSeen(req, res, next) {
        try {
            const id = req.body.id;
            await Message.updateToSeen(id);

            return res.status(201).json({
                message: 'The message has been updated successfully',
                success: true
            });
        
        } catch (error) {
            console.log(error);
            return res.status(501).json({
                message: 'Failed to update message',
                success: false,
                error: error
            });
        }
    },

}