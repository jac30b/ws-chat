class Request {
    constructor(message, user, roomID) {
        this.message = message;
        this.user = user;
        this.roomID = roomID;
    }

    static parse(data) {
        if (data && Request.isRequest(data.body)) {
            try {
                const {message} = JSON.parse(data.body);
                return new Request(message, data.user, data.roomID);
            } catch (err) {
                throw err;
            }

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