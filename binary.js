const http = require("./socket");
const BinaryServer = require('binaryjs').BinaryServer;
const binary = new BinaryServer({server: http, path: '/binary-endpoint'});

//binary server handling sound events
binary.on('connection',  (client)=> {
    console.log('Binary Server connection started');

    console.log(binary.clients);
    client.on('stream', (stream, meta)=> {
        if (meta.data === 'audio') {
            console.log('>>>Incoming audio stream');

            // broadcast to all other clients
            for(let id in binary.clients){
                if(binary.clients.hasOwnProperty(id)){
                    const otherClient = binary.clients[id];
                    if(otherClient !== client){
                        const send = otherClient.createStream(meta);
                        stream.pipe(send);
                    }
                }
            }

            stream.on('end', ()=> {
                console.log('||| Audio stream ended');
            });

        } else {
            // console.log('.');
        }
    });

    client.on('close', ()=> {
        console.log('BinaryJS Server connection closed for client:', client.id);
    });

    client.on('error', ()=> {
        client.close();
    })
});

binary.on('error',  (error)=> {
    console.log('!!!!!!OH NOOOO!!!!!! BINARYJS ERROR: ', error);
});


module.exports = http;
