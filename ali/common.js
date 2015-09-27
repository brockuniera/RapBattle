rap_settings = {
	bufferSize: 16384
}

function getWebSocket(extra_url, binary){
	// Create our websocket to rap
	var websock = new WebSocket("ws://45.55.206.4:12345/" + extra_url);

	if(binary)
		websock.binaryType = "arraybuffer";

	websock.onopen = function(e){
		console.log("connection made to servy");
	}

	websock.onclose = function(e){
		console.log("servy over(" + e.code + ")");
	}

	websock.onerror = function(e){
		console.log("error o no(" + e.data + ")");
	}
	return websock;
}
