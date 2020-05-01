const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

io.on('connection', function(socket){
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
});

http.listen(3000, () => {
	console.log("listening on *:3000");
});