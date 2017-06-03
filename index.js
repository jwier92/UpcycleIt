
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 3001;

app.use(express.static(__dirname + '/public'));

const WebSocket = require('ws');

//const wss = new WebSocket.Server({ port: 3001 }); 
const wscTemperature = new WebSocket('ws://192.168.2.138:1880/ws/temperature');
const wscButton1 = new WebSocket('ws://192.168.2.138:1880/ws/button1');
const wscTouch1 = new WebSocket('ws://192.168.2.138:1880/ws/touch1');
const wscOutletStatus = new WebSocket('ws://192.168.2.137:1880/ws/outlet/status');

// These are outputs
const wscLED1 = new WebSocket('ws://192.168.2.138:1880/ws/led1');
const wscOutletControl = new WebSocket('ws://192.168.2.137:1880/ws/outlet/control');
const wscLCD1 = new WebSocket('ws://192.168.2.138:1880/ws/lcd');
const wscTowerStatus = new WebSocket('ws://192.168.2.137:1880/ws/status');

io.on('connect', function (socket) {

	wscOutletStatus.on('message', function(data,flags) {
		console.log("Outlet Status Change:", data);
		io.emit('tower00Outlet', {
			event: 'Outlet',
			value: data	
		});
	});

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
		var d2 = JSON.parse(data);
		io.emit('eddy2', {
			event: 'Temperature',
			cel: d2.tempC,
			far: d2.tempF
		});
	});

	socket.on('Tower00OutletStatus', function(data) {
		wscTowerStatus.send("1");
	});

	socket.on('button',function(data) {
		console.log("data: ", data);
		switch (data.button) {
			case 'Tower00Outlet':
				console.log("Tower00Outlet: ", JSON.stringify(data.msg));
				wscOutletControl.send(JSON.stringify(data.msg));
				break;
			case 'led1':
				wscLED1.send(data.msg);
				console.log("LED1: ", data.msg);
				break;
			case 'lcd1Time':
				console.log("Setting LCD1 to Time",data);
				var myMSG = {
					state: "time"
				};
				console.log("sending: ",myMSG);
				wscLCD1.send(JSON.stringify(myMSG));
				break;
			case 'lcd1Temp':
				console.log("Setting LCD1 to Time",data);
				var myMSG = {
					state: "outside temperature"
				};
				console.log("sending: ",myMSG);
				wscLCD1.send(JSON.stringify(myMSG));
				break;
			case 'lcd1Custom':
				console.log("Setting LCD1 to Custom",data);
				var myMSG = {
					state: "custom",
					msg1: data.msg1,
					msg2: data.msg2,
					R: data.R,
					G: data.G,
					B: data.B
				};
				console.log("sending: ",myMSG);
				wscLCD1.send(JSON.stringify(myMSG));
				break;
		}
	});

});

server.listen(port, function() {
	console.log('Server listening at port %d', port);
});

