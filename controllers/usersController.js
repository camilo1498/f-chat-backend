const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage');


module.exports = {

    async getAll(req, res, next) {
        try {
            const id = req.params.id;
            const data = await User.getAll(id);    
            console.log(`Usuarios: ${data}`);
            return res.status(201).json(data);
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error getting users'
            });
        }
    },
    
    async checkIfIsOnline(req, res, next) {
        try {
            const id = req.params.id;
            const data = await User.checkIfIsOnline(id);    
            return res.status(201).json(data);
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error getting users'
            });
        }
    },

    async registerNoPhoto(req, res, next) {
        try {
            
            const user = req.body;
            const data = await User.create(user);

        
            return res.status(201).json({
                success: true,
                message: 'Registration was successful',
                data: data.id
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

    async registerWithImage(req, res, next) {
        try {
            
            const user = JSON.parse(req.body.user);
            console.log(`User Submitted Data: ${user}`);

            const files = req.files;

            if (files.length > 0) {
                const pathImage = `image_${Date.now()}`; // NOMBRE DEL ARCHIVO
                const url = await storage(files[0], pathImage);

                if (url != undefined && url != null) {
                    user.image = url;
                }
            }

            const data = await User.create(user);
            user.id = data.id;
            
            console.log('Usuario registrado', user);

            return res.status(201).json({
                success: true,
                message: 'Registration was successful, now log in',
                data: user
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
    
    async updateWithImage(req, res, next) {
        try {
            
            const user = JSON.parse(req.body.user);
            console.log(`User Submitted Data: ${user}`);

            const files = req.files;

            if (files.length > 0) {
                const pathImage = `image_${Date.now()}`; // NOMBRE DEL ARCHIVO
                const url = await storage(files[0], pathImage);

                if (url != undefined && url != null) {
                    user.image = url;
                }
            }

            await User.update(user);
            
            console.log('updated user', user);

            return res.status(201).json({
                success: true,
                message: 'The data update was successful',
                data: user
            });

        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'There was an error with the user update',
                error: error
            });
        }
    },

    async update(req, res, next) {
        try {
            
            const user = req.body;
            await User.update(user);
        
            return res.status(201).json({
                success: true,
                message: 'The user has been successfully updated',
                data: user
            });

        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'There was an error with the user update',
                error: error
            });
        }
    },
    
    async updateNotificationToken(req, res, next) {
        try {
            
            const body = req.body;
            await User.updateNotificationToken(body.id, body.notification_token);
        
            return res.status(201).json({
                success: true,
                message: 'The token has been successfully updated',
            });

        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'There was an error with the token refresh',
                error: error
            });
        }
    },

    async login(req, res, next) {

        try {
            
            const email = req.body.email;
            const password = req.body.password;

            const myUser = await User.findByEmail(email);

            if (!myUser) {
                return res.status(401).json({
                    success: false,
                    message: 'The email was not found'
                })
            }

            const isPasswordValid = await bcrypt.compare(password, myUser.password);

            if (isPasswordValid) {
                const token = jwt.sign({ id: myUser.id,email: myUser.email }, keys.secretOrKey, {
                    // expiresIn: 
                })

                const data = {
                    id: myUser.id,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                };
                
                return res.status(201).json({
                    success: true,
                    message: 'The user has been authenticated',
                    data: data
                });

            }
            else {
                // UNAUTHORIZED
                return res.status(401).json({
                    success: false,
                    message: 'Password is incorrect',
                });
            }


        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'There was an error with the user login',
                error: error
            });
        }

    }
};