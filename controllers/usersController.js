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
                message: 'Error al obtener los usuarios'
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
                message: 'Error al obtener los usuarios'
            });
        }
    },

    async register(req, res, next) {
        try {
            
            const user = req.body;
            const data = await User.create(user);

        
            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente',
                data: data.id
            });

        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro del usuario',
                error: error
            });
        }
    },

    async registerWithImage(req, res, next) {
        try {
            
            const user = JSON.parse(req.body.user);
            console.log(`Datos enviados del usuario: ${user}`);

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
                message: 'El registro se realizo correctamente, ahora inicia sesion',
                data: user
            });

        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro del usuario',
                error: error
            });
        }
    },
    
    async updateWithImage(req, res, next) {
        try {
            
            const user = JSON.parse(req.body.user);
            console.log(`Datos enviados del usuario: ${user}`);

            const files = req.files;

            if (files.length > 0) {
                const pathImage = `image_${Date.now()}`; // NOMBRE DEL ARCHIVO
                const url = await storage(files[0], pathImage);

                if (url != undefined && url != null) {
                    user.image = url;
                }
            }

            await User.update(user);
            
            console.log('Usuario actualizado', user);

            return res.status(201).json({
                success: true,
                message: 'La actualizacion de datos se ha realizado correctamente',
                data: user
            });

        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con la actualizacion del usuario',
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
                message: 'El usuario se ha actualizado correctamente',
                data: user
            });

        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con la actualizacion del usuario',
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
                message: 'El token se ha actualizado correctamente',
            });

        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con la actualizacion del token',
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
                    message: 'El email no fue encontrado'
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
                    message: 'El usuario ha sido autenticado',
                    data: data
                });

            }
            else {
                // UNAUTHORIZED
                return res.status(401).json({
                    success: false,
                    message: 'La contraseña es incorrecta',
                });
            }


        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el login del usuario',
                error: error
            });
        }

    }


};