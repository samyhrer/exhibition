
var subscriptions = {};
import io from 'socket.io-client';

var socket = io('http://localhost:3000');
socket.on('connect', function(){});
socket.on('START_PROVISION', function(payload){
	var messageType = 'START_PROVISION';
	var subscribers = subscriptions[messageType];
	if(subscribers){
		subscribers.forEach((cb)=>{
			cb(payload);
		});
	}
});
socket.on('REGISTER_SCREEN_UPDATE', function(payload){
  var messageType = 'REGISTER_SCREEN_UPDATE';
  var subscribers = subscriptions[messageType];
  if(subscribers){
    subscribers.forEach((cb)=>{
      cb(payload);
    });
  }
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
  socket.emit(messageType, payload);
}

module.exports = {
	subscribe: subscribe,
	unsubscribe: unsubscribe,
	send: send
}