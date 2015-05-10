
function setupSockets (io){
    io.sockets.on('connection', function (socket) {

        console.log('connection made!!!')
        //     if (socket.id !== other.id){
        //         other.emit('news', {id: socket.id, created: true});
        //         socket.emit('news', {id: other.id, created: true}); // should have data: other.data
        //     }
        // }

        
        socket.emit('hello', { hello: 'world', id: socket.id });
        socket.on('my other event', function (data) {
            console.log(socket.id, data);
            // if (typeof data['x'] === 'undefined'){
            //     return;
            // }

            // // broadcast this socket's data to all other sockets
            // var other;
            // for (var i=0, len=users.length; i<len; i++){
            //     other = users[i];
            //     if (socket.id !== other.id){
            //         other.emit('news', {id: socket.id, data: data});
            //     }
            // }
        });
        socket.on('disconnect', function(data) {
            console.log(socket.id + "has DISCONNECTED.");

            // userQueue.remove(socket);
            // userQueue.update();

            // console.log("\n**********\nNow, users:", users.map(function(u){return u.id}));
        });

        socket.on('chat', function(data){
            console.log('chat')
            // broadcast this socket's data to all other sockets
            // var other;
            // for (var i=0, len=users.length; i<len; i++){
            //     other = users[i];
            //     if (socket.id !== other.id){
            //         other.emit('chat', data);
            //     }
            // }
        });
    });
}

module.exports = setupSockets;
