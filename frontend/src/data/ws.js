
var subscriptions = {};

var host = window.document.location.host.replace(/:.*/, '');
var ws = new WebSocket('ws://' + host + ':8080');
ws.onmessage = (evt) => {
	var message = JSON.parse(evt.data);
	var messageType = message.type;
	var subscribers = subscriptions[messageType];
	if(subscribers){
		subscribers.forEach((cb)=>{
			cb(message.payload);
		});
	}
}

var subscribe = (messageType, cb) => {
	var subscription = subscriptions[messageType];
	if(!subscription) {
		subscriptions[messageType] = [cb];
	}
	else {
		subscriptions[messageType].push(cb);
	}
}

var unsubscribe = (messageType, cb) => {

}

var send = (messageType, payload) => {
	ws.send(JSON.stringify({
		type: messageType,
		payload: payload
	}));
}

module.exports = {
	subscribe: subscribe,
	unsubscribe: unsubscribe,
	send: send
}