
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 3000;

server.listen(port, function() {
	console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

const WebSocket = require('ws');

//const wss = new WebSocket.Server({ port: 3001 }); 
const wscTemperature = new WebSocket('ws://192.168.2.138:1880/ws/temperature');
const wscButton1 = new WebSocket('ws://192.168.2.138:1880/ws/button1');
const wscTouch1 = new WebSocket('ws://192.168.2.138:1880/ws/touch1');

io.on('connect', function (socket) {
	wscButton1.on('message', function(data,flags) {
		console.log("Button1 is: " + data);
		io.emit('eddy2', {
			event: 'Button1',
			value: data
		});
	});

	wscTouch1.on('message', function(data,flags) {
		console.log("Touch1 is: " + data);
		io.emit('eddy2', {
			event: 'Touch1',
			value: data
		});
	});

	wscTemperature.on('message', function(data,flags) {
		console.log("Data: ",data);
		//console.log("Flags: ",flags);
		//let dataJ = JSON.parse(data);
		//let a = dataJ.payload;
		let a = data;
		//console.log("A: ",a);
		let B = 4275;
		let R = 1023.0/a - 1.0;
		//console.log("R: ",R);
		R *= 100000.0;
		let temperature = 1.0 / (Math.log(R / 100000.0) / B + 1 / 298.15) - 273.15;
		let tempC = Math.round((temperature*100))/100;
		console.log("temperature: ", tempC);
		let tempF = Math.round((temperature * 9 / 5 + 32) * 100) / 100;
		console.log("or "+ tempF + " F");
		io.emit('eddy2', {
			event: 'Temperature',
			value: a,
			cel: tempC,
			far: tempF
		});
	});

});

