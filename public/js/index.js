var socket = io();
var n = 0;
var pageTitle = document.title;
var video = document.getElementById("video");
var user = document.getElementById("pessoa");
var notification = true;

	$(window).focus(function(){
		notification = true;
		document.title = pageTitle;
		n = 0;
		console.log(notification);
	});

	$(window).blur(function(){
		notification = false;
		console.log(notification);
	});

video.ontimeupdate = function() {getTime()};

function getTime(){	
if (user.value == 'teste') {
		socket.emit('video', video.currentTime);
	}
}

	function playVideo(){
		if (user.value == 'teste') {
			socket.emit('playVideo', video);
		}
	}

	function pauseVideo(){
		if (user.value == 'teste') {
			socket.emit('pauseVideo', video);
		}
	}

socket.on('pausaVideo', function(videos) {
		video.pause();
	});

socket.on('playsVideo', function(videos) {
		video.play();
	});

socket.on('enviaVideo', function(currentTime) {
	document.getElementById('merda').innerHTML = currentTime;
		video.currentTime = currentTime;
	});


socket.on('connect', function() {
	console.log("Connect to Server");

	// socket.emit('createMessage', {
	// 	from: 'Someone from client',
	// 	to: 'testeCliente@hotmail.com',
	// 	text: 'Hey, howdy'
	// })
});

socket.on('disconnect', function() {
	console.log("Disconnected from server");
});

socket.on('newNotification', function(message){
    		
});

socket.on('newMessage', function(message) {
	console.log("Message: ", message.from, message.text);

	var li = $('<li class="mensagem-unica"></li>');
	li.text(`${message.from}: ${message.text}`);

	$('#messages').append(li);
	
    $('#messages').scrollTop( 99999 );

    if (notification) {
    	notifyMe(message.text);
    	
    }else{
    	document.title = "("+ ++n + ") " + pageTitle; 
    }

});


// socket.emit('createMessage', {
// 		from: "Frank",
// 		text: "Hi"
// 	}, 
// 	function(data){
// 	console.log('got it from client - and - ', data);
// });

$('#message-form').on('submit', function(e){
	e.preventDefault();

	socket.emit('createMessage', {
	from: $('[name=user]').val(), 
	text: $('[name=message]').val()
	},function(){
		$('[name=message]').val(" ");
	});

});

function notifyMe(msg) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(msg);
    setTimeout(notification.close.bind(notification), 4000);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(msg);
        setTimeout(notification.close.bind(notification), 4000);

      }
    });
  }

  // At last, if the user has denied notifications, and you 
  // want to be respectful there is no need to bother them any more.
}