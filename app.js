const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

/**use dependencies*/
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(morgan('dev'));

/**connect db*/
mongoose.connect('mongodb://127.0.0.1:27017/chat', {useNewUrlParser: true});

mongoose.connection.on('error',(error)=>{
    console.log(error)
});

/**import custom router module*/
require('./modules/router')(app);

/**custom error handler*/
app.use((req,res,next)=>{
   const error = new Error('Not found');
   error.status = 404;
   next(error)
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500).json({
        error:{
            message: error.message
        }
    })
});

module.exports = app;
