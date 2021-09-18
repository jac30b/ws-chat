const urlParser = require('url-parse');
const qs = require('qs');
const {Auth} = require('./Auth');

class Router {
    constructor() {
        this.routes = [];
    }

    addRoute(method, urlPattern, cb){
        this.routes.push({method, urlPattern, cb})
    }

    resolve(req){
        const path = new urlParser(req.url);
        const parsedParams = qs.parse(path.query,  {ignoreQueryPrefix: true});
        for(let {method, urlPattern, cb} of this.routes){
            if(urlPattern.exec(path.pathname) && method === req.method) {
                return cb(parsedParams, req);
            }
        }
        return null;
    }
}

module.exports.Router = Router;