var
startListening = function(){
	// Start off by initializing a new context.
	var context = new (window.AudioContext || window.webkitAudioContext)();

	// Create websocket
	var websock = getWebSocket();
	// Messages push data into array
	websock.onmessage = onMessageAdd;

	// Processer
	var processer = context.createScriptProcessor(rap_settings.bufferSize, 1, 1);
	// Connect to speakers
	processer.connect(context.destination);

	processer.onaudioprocess = function(audioEvent){
		var sample;
		var outputData = audioEvent.outputBuffer.getChannelData(0);

		var dataArray = queue.shift();
		
		// 0 out array if no data
		if(dataArray === undefined){
			for (sample = 0; sample < outputData.length; sample++) {
				outputData[sample] = 0;
			}
			return;
		}

		for (sample = 0; sample < outputData.length; sample++) {
			outputData[sample] = inputData[sample];
		}
	}
},

onMessageAdd = function(e){
	queue.push(e)
},

queue = []

window.onload = function(){
	startListening();
}
