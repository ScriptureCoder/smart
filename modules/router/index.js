const fs = require('fs');

module.exports = (app) => {
    fs.readdirSync(__dirname + '/routes/').forEach((file)=>{
        require(`./routes/${file.substr(0, file.indexOf('.'))}`)(app);
    })
};
