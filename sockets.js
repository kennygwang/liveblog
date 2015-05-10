var users = require('./routes/users')
  , blogs = require('./routes/blogs');


module.exports = function(io){
    io.sockets.on('connection', function (socket) {
        // when a new post message is emitted, emit the post and blog ID to everyone
        socket.on('new post created', function(data) {
            socket.emit(data.blogId, { post: data.post });
        });
    });
};