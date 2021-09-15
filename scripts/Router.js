const urlParser = require('url-parse');
const qs = require('qs');
const {Auth} = require('./Auth');

function Router(){}

Router.route = (url, data) => {
    const parsedUrl = new urlParser(url);
    console.log(parsedUrl);
    if(parsedUrl.pathname == '/login'){
        //TODO: Generate token and store it.
        //TODO: Move code to separate file.

        const parsedParams = qs.parse(parsedUrl.query,  {ignoreQueryPrefix: true});
        return Auth.generateToken(parsedParams.user);
    }   
}

module.exports.Router = Router;