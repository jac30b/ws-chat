class Request {
    constructor(message, user, roomID, method) {
        this.message = message;
        this.method = method;
        this.user = user;
        this.roomID = roomID;
    }

    static parse(data) {
        if (data && Request.isRequest(data.body)) {
            try {
                const { message, method } = JSON.parse(data.body);
                return new Request(message, data.user, data.roomID, method);
            } catch (err) {
                throw err;
            }
        }
    }

    static isRequest(data) {
        const allowedMethods = ["sendMessage"];

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
        };

        try {
            const parsedData = JSON.parse(data);
            const depth = getDepth(parsedData);

            if (depth !== 1) {
                return false;
            }
            console.log(parsedData.method);
            return (
                (parsedData.hasOwnProperty("message") ||
                    parsedData.hasOwnProperty("roomID")) &&
                parsedData.hasOwnProperty("method") &&
                allowedMethods.includes(parsedData.method)
            );
        } catch (e) {
            return false;
        }
    }
}

module.exports.Request = Request;
