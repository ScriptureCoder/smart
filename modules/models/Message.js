const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new mongoose.Schema({
    user: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    from: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String,
    },
    time:{
        type: String,
        default: Date.now()
    },
    delivery: {
        type: Number,
        default: 2
    }

});
module.exports = mongoose.model('Message', MessageSchema);
