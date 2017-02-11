const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const messages = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log("new user connected");

	// socket.emit('newMessage', {
	// 	from: 'email@hotmail.com',
	// 	text: 'text of emails from server',
	// 	createdAt: 123
	// });
	socket.emit('newMessage', messages.generateMessage("Admin", "Wellcome,server using port " + port));

	socket.broadcast.emit("newMessage", messages.generateMessage("Admin", "New Guy in room"));

	socket.on('video', (video) => {
		socket.broadcast.emit('enviaVideo', video );
	});

	socket.on('pauseVideo', (video) => {
		io.emit('pausaVideo', video );
	});

	socket.on('playVideo', (videoPlay) => {
		io.emit('playsVideo', videoPlay );
	});

	socket.on('createMessage', (message, callback) => {
		console.log('createMessage', messages.generateMessage(message.from, message.text));
		io.emit('newMessage', messages.generateMessage(message.from, message.text));
		
		socket.broadcast.emit('newNotification', messages.generateMessage(message.from, message.text))
		callback('got it from server');

		//socket.broadcast.emit('newMessage', message.generateMessage("Admin", message));

	});

	socket.on('disconnect', () => {
			console.log("User disconnected");
		});
});


server.listen(port, () => {
	console.log(' Server online on port ', port);
});