$(function() {

	var socket = io();

	socket.on('eddy2', function (data) {
      addChatMessage(data);
		console.log(data);
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

