const UsersController = require('../controllers/usersController');
const passport = require('passport');

module.exports = (app, upload) => {

    // TRAER DATOS
    // 401 EL CLIENTE NO ESTA AUTORIZADO PARA REALIZAR ESTA PETICION
    app.get('/api/users/getAll/:id', passport.authenticate('jwt', {session: false}), UsersController.getAll);
    app.get('/api/users/checkIfIsOnline/:id', passport.authenticate('jwt', {session: false}), UsersController.checkIfIsOnline);

    // GUARDAR DATOS
    app.post('/api/users/create', upload.array('image', 1), UsersController.registerWithImage);
    app.post('/api/users/login', UsersController.login);
    app.post('/api/users/simple-create', UsersController.register);

    // ACTUALIZACION DATOS
    app.put('/api/users/updateWithImage', passport.authenticate('jwt', {session: false}), upload.array('image', 1), UsersController.updateWithImage);
    app.put('/api/users/update', passport.authenticate('jwt', {session: false}), UsersController.update);
    app.put('/api/users/updateNotificationToken', passport.authenticate('jwt', {session: false}), UsersController.updateNotificationToken);
}