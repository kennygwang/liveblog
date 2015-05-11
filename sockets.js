var users = require('./routes/users')
  , blogs = require('./routes/blogs');


module.exports = function(io){
    io.sockets.on('connection', function (socket) {
        //console.log('New client connected.'+socket.id);

        // User starts watching a blog
        socket.on('watch', function(data) {
        	//console.log(typeof data.blogId);
        	//console.log(socket.id + ' watching blog ' + data.blogId);
        	socket.join(data.blogId);
        })

        // when a new post message is emitted, emit the post and blog ID to everyone
        socket.on('new post', function(data) {
        		//console.log(typeof data.blogId);
        		//console.log(data.post);
            io.to(data.blogId).emit('send post', { post: data.post });
            //console.log('-----\nBroadcasting post over socket channel: '+data.blogId + '\n--------');
        });

        // when a delete post message is emitted, emit the post and blog ID to everyone
        socket.on('delete post', function(data) {
            io.to(data.blogId).emit('delete post', { postId: data.postId });
        });
    });
};
