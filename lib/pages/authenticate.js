"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationPage = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const querystring_1 = __importDefault(require("querystring"));
const auth_1 = require("../auth");
exports.AuthenticationPage = (() => {
    const html = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '..', '..', 'src', 'pages', 'authenticate.html'));
    const length = html.length;
    return ({
        statusCode: 200,
        head: {
            'Content-Type': 'text/html',
            'Content-Length': length.toString(),
        },
        body: html,
    });
})();
function authenticate(request) {
    if (!request.body)
        return exports.AuthenticationPage;
    const requestBody = ((request.body instanceof Buffer)
        ? request.body.toString('utf-8')
        : request.body.toString());
    const { action, username, password, } = querystring_1.default.parse(requestBody);
    if (!username || !password)
        return exports.AuthenticationPage;
    if (typeof username !== 'string')
        return exports.AuthenticationPage;
    if (typeof password !== 'string')
        return exports.AuthenticationPage;
    const session = auth_1.createSession(username, password);
    return session ? ({
        statusCode: 302,
        head: {
            Location: '/',
            'Set-Cookie': `session=${session}; SameSite=Strict`,
        },
    }) : (((action === 'Register') && auth_1.createUser(username, password))
        ? authenticate(request)
        : exports.AuthenticationPage);
}
exports.default = authenticate;
module.exports = authenticate;
module.exports.AuthenticationPage = exports.AuthenticationPage;
