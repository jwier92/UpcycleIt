$(function() {

	var socket = io();

	socket.on('eddy2', function (data) {
      		addChatMessage(data);
		console.log(data);
	});

	$('#relay1on').on('click',function() {
		console.log('Socket Emit Relay1 ON');
		socket.emit('button', {
			button: 'relay1',
			msg: 1
		});
	});
	$('#relay1off').on('click',function() {
		console.log('Socket Emit Relay1 OFF');
		socket.emit('button', {
			button: 'relay1',
			msg: 0
		});
	});
	$('#led1on').on('click',function() {
		console.log('Socket Emit LED1 ON');
		socket.emit('button', {
			button: 'led1',
			msg: 1
		});
	});
	$('#led1off').on('click',function() {
		console.log('Socket Emit LED1 OFF');
		socket.emit('button', {
			button: 'led1',
			msg: 0
		});
	});

});

function addChatMessage (data, options) {
	switch (data.event) {
		case "Temperature":
			$('span#tempC').html(data.cel);
			$('span#tempF').html(data.far);
			break;
		case "Button1":
			var button = "Off";
			if (data.value == "1") button = "On";
			$('span#button1').html(button);
			break;
		case "Touch1":
			var button = "Not Touched";
			if (data.value == "1") button = "Touched";
			$('span#touch1').html(button);
			break;
	}
}

