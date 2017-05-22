$(function() {

	var socket = io();

	socket.emit('Tower00OutletStatus', { command: 'update' });

	socket.on('eddy2', function (data) {
      		addChatMessage(data);
		//console.log(data);
	});

	socket.on('tower00Outlet', function(data) {
		console.log("New tower message: ", data);
		var outlets = JSON.parse(data.value);
		$.each(outlets,function(key,outlet) {
			console.log("Outlet change: ",outlet);
			var state = outlet.state;
			var stateMsg = "Off";
			if (state == "on") stateMsg = "On";
			$('div#tower00' + outlet.control).removeClass('oboff').removeClass('obon')
				.addClass('ob'+state).data("state", state);
			$('div#tower00' + outlet.control + " div.status").text(stateMsg);
		});	
	});

	$('.ob').on('click',function() {
		var currentState = $(this).data("state");
		var control = $(this).data("control");
		var device = $(this).data("device");
		var state = "on";
		if (currentState == "on")
			state = "off"
		//console.log('Device:', device);
		//console.log('Control:', control);
		//console.log('Current State:', currentState);
		//console.log('New State:', state);
		socket.emit('button', {
			button: 'Tower00Outlet',
			msg: {
				outlet: control,
			 	state: state
			} 
		});
	});
	$('#led1on').on('click',function() {
		//console.log('Socket Emit LED1 ON');
		socket.emit('button', {
			button: 'led1',
			msg: 1
		});
	});
	$('#led1off').on('click',function() {
		//console.log('Socket Emit LED1 OFF');
		socket.emit('button', {
			button: 'led1',
			msg: 0
		});
	});
	$('#lcd1time').on('click',function() {
		//console.log('Socket Emit LCD1 Time');
		socket.emit('button', {
			button: 'lcd1Time',
			msg: 0
		});
	});
	$('#lcd1temp').on('click',function() {
		//console.log('Socket Emit LCD1 Time');
		socket.emit('button', {
			button: 'lcd1Temp',
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

