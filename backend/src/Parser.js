const {Request} = require('./Request');

class Parser {
    static parse(data) {
        if(Request.isRequest(data.body)){
            return Request.parse(data);
        }
    }
}

module.exports.Parser = Parser;

