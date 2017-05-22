
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
		//console.log("Data: ",data);
		//console.log("Flags: ",flags);
		//var dataJ = JSON.parse(data);
		//var a = dataJ.payload;
		var a = data;
		//console.log("A: ",a);
		var B = 4275;
		var R = 1023.0/a - 1.0;
		//console.log("R: ",R);
		R *= 100000.0;
		var temperature = 1.0 / (Math.log(R / 100000.0) / B + 1 / 298.15) - 273.15;
		var tempC = Math.round((temperature*100))/100;
		//console.log("temperature: ", tempC);
		var tempF = Math.round((temperature * 9 / 5 + 32) * 100) / 100;
		//console.log("or "+ tempF + " F");
		io.emit('eddy2', {
			event: 'Temperature',
			value: a,
			cel: tempC,
			far: tempF
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
		}
	});

});

server.listen(port, function() {
	console.log('Server listening at port %d', port);
});

