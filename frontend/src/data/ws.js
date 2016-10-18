
var subscriptions = {};
import io from 'socket.io-client';

var socket = io('http://localhost:3000');
socket.on('connect', function(){});
socket.on('event', function(data){
	console.log(data);
});
socket.on('disconnect', function(){});
/*
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
*/
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
	/*
	ws.send(JSON.stringify({
		type: messageType,
		payload: payload
	}));
	*/
}

module.exports = {
	subscribe: subscribe,
	unsubscribe: unsubscribe,
	send: send
}