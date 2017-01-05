var io = require('socket.io-client');
var sentiment = require('sentiment');

firstConnect = 0;

//connect to the main server
var socket = io.connect('http://localhost:3020');
socket.on('connect', function() {
	//grab the socket id
	sessionid = socket.io.engine.id;
	//tell the server its ready upon first connect
	if (firstConnect == 0){
		socket.emit('con from processor', { alive: sessionid });
		firstConnect = 1;
	}

	socket.on('do work', function(data) {
		console.log('doing work');
		temp = sentiment(data.text);
		//send data back to server
		socket.emit('finished work', { id: sessionid, score: temp.score, text: data.text });
	});
});