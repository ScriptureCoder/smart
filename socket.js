const app = require('./app');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const redisAdapter = require('socket.io-redis');
const User = require('./modules/models/User');
const Queue = require('./modules/models/Queue');
const Message = require('./modules/models/Message');
const MessageController = require('./modules/controllers/MessageController');
const ss = require('socket.io-stream');
const fs = require('fs');

// io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

let online = [];

io.on('connection',async (socket)=>{

    console.log("One connected");
     let session;

    socket.on('login', async (data)=>{

        const user = await User.findOne({username: data.username, password: data.password});

        if (user){
            let dbUsers = await User.find();
            let users = {};
            online.push(`${user._id}`);
            session = `${user._id}`;

            dbUsers.forEach((data)=>{
                const id = data._id;
                const message = Message.find().and([{user: data._id}, {user: user._id}]);
                const queue = Queue.find().and([{user: data._id}, {user: user._id}]);

                Promise.all([message,queue]).then((res)=>{
                    users[data._id] = {
                        username:data.username,
                        messages:res[0],
                        queue: res[1],
                        pending:[],
                        online: online.indexOf(`${id}`) > -1
                    }
                }).then(()=>{
                    socket.emit('onlineUsers',users);
                    socket.broadcast.emit('onlineUsers',users);
                });
            });

            socket.emit('user',user._id);

        }

    });

    socket.on('message',(data,fn)=>{
        fn("sent");
        MessageController.queue(data);
        socket.broadcast.emit([data.to],data)
    });

    socket.on('typing',(data)=>{
        socket.broadcast.emit([data.to],data)
    });

    socket.on('read',(data)=>{
        socket.broadcast.emit([data.to],data)
    });

    socket.on('stream', function (data) {
        ss(socket).on('inaudio', (stream, data)=> {
            console.log("in DATA -->> ");
            stream.on('data', (chunk) => {
                console.log(chunk)
            });
        });
    });

    /*socket.on('stream', function (data) {
        console.log(data);
        const stream = ss.createStream();
        const filename = __dirname + '/song.mp3' ;
        ss(socket).emit('audio-stream', stream, { name: filename });
        fs.createReadStream(filename).pipe(stream);
    });*/

    socket.on('disconnect',(data)=>{
        if (session) {
            socket.broadcast.emit('offline',session);
            online.splice(online.indexOf(session),1);
            console.log(online);
        }
    })
});



module.exports = http;
