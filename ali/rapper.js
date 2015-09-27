var startRapping = function(){
	// Start off by initializing a new context.
	var context = new (window.AudioContext || window.webkitAudioContext)();
	var socket = io('http://45.55.206.4:9090');

	// Delay config
	var delayMilis = 40.0;
	var delayNode = context.createDelay(delayMilis);
	var $range = $("#delay");
	$range.value = delayMilis;
	$range.change(function(e){
			delayNode.delayTime.value = this.value;
			console.log(this.value);
			});

	navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia; // TODO use all browsers
	navigator.getUserMedia(
			{audio: true},
			gotAudio,
			noAudio
			);

	// Processer
	var processer = context.createScriptProcessor(rap_settings.bufferSize, 1, 1);
	processer.onaudioprocess = function(audioEvent){
		/*
		   var a = audioEvent.inputBuffer.getChannelData(0).buffer;
		   var b = audioEvent.outputBuffer.getChannelData(0).buffer;
		   for(var i = 0; i < a.length; i++){
		   b[i] = a[i];
		   }
		 */
		socket.emit('rap', audioEvent.inputBuffer.getChannelData(0).buffer);
	}
	processer.connect(context.destination);


	function gotAudio(stream){

		var mic = context.createMediaStreamSource(stream);
		var beat = context.createMediaElementSource(
				document.getElementById('rapBeat')
				);
		document.getElementById('rapBeat').play();
 
		beat.connect(context.destination);

		// mono mode
		var micMono = context.createChannelSplitter(1);
		var beatMono = context.createChannelSplitter(1);
		beat.connect(delayNode);
		delayNode.connect(beatMono);
		mic.connect(micMono);

		// Mix node
		var mix = context.createGain();
		micMono.connect(mix);
		beatMono.connect(mix);

		// Connect to processer
		mix.connect(processer);
	}

	function noAudio(stream){
		alert("Woah dude, you gotta enable your mic");
	}
}
