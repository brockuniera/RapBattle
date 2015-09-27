rap_settings = {
	bufferSize: 256
}

function getWebSocket(){
	// Create our websocket to rap
	var websock = new WebSocket("ws://45.55.206.4:12345/echo");
	websock.binaryType = "arraybuffer";
	return websock;
}
