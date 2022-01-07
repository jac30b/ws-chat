const { Request } = require("./Request");

class Parser {
    static parse(data) {
        return new Promise((resolve, reject) => {
            if (Request.isRequest(data.body)) {
                resolve(Request.parse(data));
            } else {
                reject("Wrong request.");
            }
        });
    }
}

module.exports.Parser = Parser;
