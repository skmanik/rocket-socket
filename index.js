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
	io.emit('updatedUsers', userData);

	io.to(socket.id).emit('currentUser', socket.id);

	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});

	socket.on('sendMessage', function(message){
		console.log("sendMessage occurred", message);

		let targetSocket = message.user_id;

		io.to(targetSocket).emit('sendMessage', message);
  	});

	socket.on('disconnect', () => {
	    console.log("user disconnected", socket.id);
	    userData = removeUser(socket.id, userData);
	    console.log("current userData", userData);

	    io.emit('updatedUsers', userData);
  	});
});

http.listen(3000, () => {
	console.log("listening on *:3000");
});