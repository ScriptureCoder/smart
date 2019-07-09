const Message = require('../models/Message');
const Queue = require('../models/Queue');

exports.queue= async (data)=>{
    const body = {
        user: [data.from, data.to],
        from: data.from,
        to: data.to,
        message: data.message,
        time: data.time
    };

    new Queue(body).save((err,doc)=>{
        if (err){
            console.log(err);
        } else {
            return {success: true}
        }
    })
};

exports.move= async (user)=>{
    const queues = await Queue.find({user:user});
    queues.forEach((data)=>{
        new Message({...data,delivery:2}).save((err,data)=>{
            if (err){
                throw new Error(err);
            }
            data.delete();
        });
    });
};
