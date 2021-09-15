const {Request} = require('./Request');

function Parser(data) {}

Parser.prototype.parse = (data) => {
    if(data && Parser.isValidData(data)){
        data = JSON.parse(data);
        if(Request.isRequest(data)){
            return new Request(data.message, data.type, data.user, data.room);
        } 
    }
}

Parser.isValidData = (data) => {
    const getDepth = (tree) => {
        let depth = 0;
        if(tree.children) {
           tree.children.forEach((child) => {
               let tmp = getDepth(child);
               if(tmp > depth) {
                   depth = tmp;
               }
           });
        }
        return 1 + depth;
    }

    try {
        const parsedData = JSON.parse(data);
        const depth = getDepth(parsedData);

        if(depth != 1) {
           return false;
        }
        
        return parsedData.hasOwnProperty('type') &&  parsedData.hasOwnProperty('message') 
                 && parsedData.hasOwnProperty('user') && parsedData.hasOwnProperty('room');
    
    } catch (e) {
        return false;
    }
}

module.exports.Parser = Parser;

