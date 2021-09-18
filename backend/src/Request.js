class Request {
    constructor(message, user, room) {
        this.message = message;
        this.user = user;
        this.room = room;
    }

    parse(data) {
        if (data && Request.isRequest(data)) {
            data = JSON.parse(data);
            return new Request(data.message, data.type, data.user, data.room);
        }
    }

    static isRequest(data) {
        const getDepth = (tree) => {
            let depth = 0;
            if (tree.children) {
                tree.children.forEach((child) => {
                    let tmp = getDepth(child);
                    if (tmp > depth) {
                        depth = tmp;
                    }
                });
            }
            return 1 + depth;
        }

        try {
            const parsedData = JSON.parse(data);
            const depth = getDepth(parsedData);

            if (depth !== 1) {
                return false;
            }

            return parsedData.hasOwnProperty('message');

        } catch (e) {
            return false;
        }
    }
}

module.exports.Request = Request;