function Request(message, type, user, room){
    this.message = message;
    this.type = type;
    this.user = user;
    this.room = room;
}

Request.isRequest = (data) => {
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

        if(depth !== 1) {
            return false;
        }

        return parsedData.hasOwnProperty('type') &&  parsedData.hasOwnProperty('message')
            && parsedData.hasOwnProperty('user') && parsedData.hasOwnProperty('room');

    } catch (e) {
        return false;
    }
}

Request.parse = (data) => {
    if(data && Request.isRequest(data)){
        data = JSON.parse(data);
        if(Request.isRequest(data)){
            return new Request(data.message, data.type, data.user, data.room);
        }
    }
}

module.exports.Request = Request;