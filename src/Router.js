const urlParser = require("url-parse");
const qs = require("qs");

class Router {
    constructor() {
        this.routes = [];
    }

    addRoute(method, urlPattern, cb) {
        this.routes.push({ method, urlPattern, cb });
    }

    resolve(req) {
        const path = new urlParser(req.url);
        const parsedParams = qs.parse(path.query, { ignoreQueryPrefix: true });
        for (let { method, urlPattern, cb } of this.routes) {
            if (method === req.method && urlPattern === path.pathname) {
                return cb(parsedParams, req);
            }
        }
        return null;
    }
}

module.exports.Router = Router;
