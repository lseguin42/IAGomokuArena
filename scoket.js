var net = require('net');

var server = net.createServer(function (socket) {
	console.log('client connected');
	socket.on('end', function () {
		console.log('client disconnect');
	});
	socket.write('hello world\r\n');
	socket.pipe(socket);
});
server.listen(4242);