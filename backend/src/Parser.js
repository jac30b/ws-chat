const {Request} = require('./Request');

class Parser {
    static parse(data) {
        if(Request.isRequest(data)){
            return this.parse(data);
        }
    }
}

module.exports.Parser = Parser;

