const UsersController = require('../controllers/usersController');
const passport = require('passport');

module.exports = (app, upload) => {

    
    app.get('/api/users/getAll/:id', passport.authenticate('jwt', {session: false}), UsersController.getAll);
    app.get('/api/users/checkIfIsOnline/:id', passport.authenticate('jwt', {session: false}), UsersController.checkIfIsOnline);

    
    app.post('/api/users/create', upload.array('image', 1), UsersController.registerWithImage);
    app.post('/api/users/login', UsersController.login);
    app.post('/api/users/single-create', UsersController.registerNoPhoto);

   
    app.put('/api/users/updateWithImage', passport.authenticate('jwt', {session: false}), upload.array('image', 1), UsersController.updateWithImage);
    app.put('/api/users/update', passport.authenticate('jwt', {session: false}), UsersController.update);
    app.put('/api/users/updateNotificationToken', passport.authenticate('jwt', {session: false}), UsersController.updateNotificationToken);
}