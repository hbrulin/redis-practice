var app = require('http').createServer(handler);
app.listen(8088);
var io = require('socket.io')(app);
var redis = require('redis');
var fs = require('fs');

function handler(req,res){
    fs.readFile(__dirname + '/index.html', function(err,data){
        res.writeHead(200);
        console.log("Listening on port 8088");
        res.end(data);
    });
}
 
var pub = redis.createClient();
var sub = redis.createClient();
sub.on("message", function (channel, data) {
        data = JSON.parse(data);
        console.log("Inside Redis_Sub: data from channel " + channel + ": " + (data.sendType));
        io.sockets.in(channel).emit(data.method, data.data);
    });

io.sockets.on('connection', function (socket) {

    sub.on("subscribe", function(channel, count) {
        console.log("Subscribed to " + channel + ". Now subscribed to " + count + " channel(s).");
    });

    socket.on("setUsername", function (data) {
        console.log("Got 'setUsername' from client, " + JSON.stringify(data));
    });

    socket.on("createRoom", function (data) {
        console.log("Got 'createRoom' from client , " + JSON.stringify(data));
        sub.subscribe(data.room);
        socket.join(data.room);     

        var reply = JSON.stringify({
                method: 'message', 
                data: "Room Name: " + data.room
            });
        pub.publish(data.room,reply);


    });
    socket.on("joinRooom", function (data) {
        console.log("Got 'joinRooom' from client , " + JSON.stringify(data));
        sub.subscribe(data.room);
        socket.join(data.room);

        var reply = JSON.stringify({
            method: 'message', 
            data: data.user +" just joined room " + data.room
        });
        pub.publish(data.room,reply);

    });
    socket.on("sendMessage", function (data) {
        console.log("Got 'sendMessage' from client , " + JSON.stringify(data));
        var reply = JSON.stringify({
                method: 'message', 
                data: data.user + ":" + data.msg 
            });
        pub.publish(data.room,reply);

    });

    socket.on('disconnect', function () {
        sub.quit();
        pub.publish("chatting","User is disconnected :" + socket.id);
    });

  });