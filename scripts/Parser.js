const {Request} = require('./Request');

function Parser(data) {}

Parser.prototype.parse = (data) => {
    if(Request.isRequest(data)){
        return Request.parse(data);
    }
}

module.exports.Parser = Parser;

