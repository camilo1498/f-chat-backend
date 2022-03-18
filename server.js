const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const multer = require('multer');
const passport = require('passport');
const io = require('socket.io')(server);

/*SOCKETS*/ 
const chatSocket = require('./sockets/chat_socket');


/*RUTAS*/
const users = require('./routes/usersRoutes');
const chats = require('./routes/chatsRoutes');
const messages = require('./routes/messagesRoutes');

const port = process.env.PORT || 3001;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());


require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port', port);

chatSocket(io);

const upload = multer({
    storage: multer.memoryStorage()
})


/*Route call*/
users(app, upload);
chats(app);
messages(app, upload);

server.listen(port);


/*ERROR HANDLER*/
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

module.exports = {
    app: app,
    server: server
}
