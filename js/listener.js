window.onload = function(){

	var
	setupWebSocket = function(){
	}

	var 
	// Start off by initializing a new context.
	var context = new (window.AudioContext || window.webkitAudioContext)();

	function pushToWebSocket(floatarray){
		websock.send(floatarray.buffer);
	}

	function noAudio(stream){
		console.log("bad");
	}

	// Create our websocket to rap
	var websockuri = "ws://45.55.206.4:12345/echo";
	var websock = new WebSocket(websockuri);
	websock.binaryType = "arraybuffer";

	websock.onopen = function(e){
		console.log("connection made to servy");
	}

	websock.onclose = function(e){
		console.log("servy over(" + e.code + ")");
	}

	// TODO this will contain watcher song data
	websock.onmessage = function(e){
		//console.log("message received(" + e.data + ")");
	}

	websock.onerror = function(e){
		console.log("error o no(" + e.data + ")");
	}


	// Processer
	var processer = context.createScriptProcessor(512, 2, 2);
	processer.connect(context.destination);

	processer.onaudioprocess = function(audioEvent){
		// The input buffer is the song we loaded earlier
		var inputBuffer = audioEvent.inputBuffer;

		// The output buffer contains the samples that will be modified and played
		//var outputBuffer = audioEvent.outputBuffer;

		// Grab channel data, send it over
		var inputData = inputBuffer.getChannelData(0);
		pushToWebSocket(inputData);

		// Loop through the output channels (in this case there is only one)
		/*
		   for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
		   var inputData = inputBuffer.getChannelData(channel);
		   var outputData = outputBuffer.getChannelData(channel);

		// Loop through the 4096 samples
		for (var sample = 0; sample < inputBuffer.length; sample++) {
		// make output equal to the same as the input
		outputData[sample] = inputData[sample];
		}
		}
		 */
	}

	function gotAudio(stream){
		var mic = context.createMediaStreamSource(stream);
		var beat = context.createMediaElementSource(
				document.getElementById('rapBeat')
				);

		// Mix node
		var mix = context.createGain();
		mic.connect(mix);
		beat.connect(mix);

		// Connect to processer
		mix.connect(processer);
	}


}
