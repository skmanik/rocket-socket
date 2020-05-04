const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// helpers
createUser = (id, arr) => {
	return {
		user_id: id
	};
}

removeUser = (id, arr) => {
	return arr.filter(item => {
		return item.user_id !== id;
	});
}

// routing and socket stuff
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

// user state
let userData = [];

io.on('connection', function(socket){

	console.log("user connected", socket.id);
	userData.push(createUser(socket.id));
	console.log("user added", userData);

	// send info to client
	io.emit('added', userData);

	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});

	socket.on('sendMessage', function(msg){
		console.log("sendMessage occurred", msg);

		let message_params = {
		  user_id: 234,
		  room_id: 14,
		  type: "reaction",
		  text: msg
		};

		let message = message_params;

		io.emit('sendMessage', message);
  	});

	socket.on('disconnect', () => {
	    console.log("user disconnected", socket.id);
	    userData = removeUser(socket.id, userData);
	    console.log("current userData", userData);
  	});
});

http.listen(3000, () => {
	console.log("listening on *:3000");
});