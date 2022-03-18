const MessagesController = require('../controllers/messagesController');
const passport = require('passport');

module.exports = (app, upload) => {


    
    app.get('/api/messages/findByChat/:id_chat', passport.authenticate('jwt', {session: false}), MessagesController.findByChat);

    app.post('/api/messages/create', passport.authenticate('jwt', {session: false}), MessagesController.create);

    app.post('/api/messages/createWithImage', passport.authenticate('jwt', {session: false}), upload.array('image', 1), MessagesController.createWithImage);
    app.post('/api/messages/createWithVideo', passport.authenticate('jwt', {session: false}), upload.single('video'), MessagesController.createWithVideo);
    
    app.put('/api/messages/updateToSeen', passport.authenticate('jwt', {session: false}), MessagesController.updateToSeen);

    
}