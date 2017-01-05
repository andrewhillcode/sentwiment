var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var https = require('https');
var sentiment = require('sentiment');
var twit = require('twitter')

//use the 'public' directory
app.use(express.static(__dirname + '/public'));

const port = 3020;

var keywords = ' ';
var processorQueue = [];
var processorsReady = [];
var	runningTotal = 0;
var	positive = 0;
var	neutral = 0;
var	negative = 0;
var	scorePos = 0;
var	scoreNeg = 0;



function stream(keywords){
	emitKeywords();

	//reset all of the counting variables.
	runningTotal = 0;
	positive = 0;
	neutral = 0;
	negative = 0;
	scorePos = 0;
	scoreNeg = 0;

	/*
		//Cameron's Twitter Keys
		twitter = new twit({
			consumer_key: '', 
			consumer_secret: '',
			access_token_key: '',
			access_token_secret: ''
		});
	*/	

		//Andrew's Twitter Keys
	var	 twitter = new twit({
			consumer_key: '', 
			consumer_secret: '',
			access_token_key: '',
			access_token_secret: ''
		});


	
	//open the stream
	twitter.stream('statuses/filter', {track: keywords}, function(stream){
		//when we get data
		stream.on('data', function(data){
			//throw it away with there is no text
			if (data.text != null) {
				//throw it away if it is shortened by ...
				if (!data.text.includes("…")) {

					//if no processors available wait until there is one
					if(processorQueue.length == 0) {
						console.log('no processors available');
						var timeout = setInterval( function() { 
							if(processorQueue.length > 0) {
								clearInterval(timeout); isFinished = true; 
							} 
						}, 50);
					}

					//take the first processor off the queue
					sock = processorQueue.shift();
					//tell processor to do work
			   		io.to(sock).emit("do work", { text: data.text});
			   	}
			}

		});

	});

}


function emitKeywords(){
	io.emit('currently tracking', { keywords: keywords });
}


io.on('connection', function (socket) {
	emitKeywords();

	socket.on('change tracking', function (data) {
		//update the keywords
		keywords = data.keywords;
		//send the keywords to all clients
		emitKeywords();
		//open the stream
		stream(data.keywords);
	});

	socket.on('con from processor', function (data) {
		console.log(data.alive);
		//join a room to talk to the processor
		socket.join(data.alive);
		//add processor to the ready queue
		processorQueue.push(data.alive);
		console.log(processorQueue);
		console.log('got processor');
	});

    socket.on('finished work', function (data) {
    	//calculate some score data
		runningTotal++;
		if (data.score > 0){
			positive++;
			scorePos = scorePos + data.score;
		}
		if (data.score == 0){
			neutral++;
		}
		if (data.score < 0){
			negative++;
			scoreNeg = scoreNeg - data.score;
		}
		var posPercent = Math.round((positive/runningTotal) * 100);
		var negPercent = Math.round((negative/runningTotal) * 100);
		var neuPercent = Math.round((neutral/runningTotal) * 100);
		var scorePosPercent = Math.round((scorePos/(scorePos+scoreNeg)) * 100);
		var scoreNegPercent = Math.round((scoreNeg/(scorePos+scoreNeg)) * 100);

		//send everything to the clients
		io.emit('update', {
			score : data.score,
		 	message : data.text, 
		 	runningTotal : runningTotal, 
		 	positive : positive, 
		 	neutral : neutral, 
		 	negative : negative, 
		 	scorePos : scorePos, 
		 	scoreNeg : scoreNeg,
		 	posPercent : posPercent,
		 	negPercent : negPercent,
		 	neuPercent : neuPercent,
		 	scorePosPercent : scorePosPercent,
		 	scoreNegPercent : scoreNegPercent
		 });

		//add the processor back to the queue
		processorQueue.push(data.id);
		console.log('recieved work');
	});

});

server.listen(port, function () {
 	console.log(`Express app listening on ${port}`);
});
