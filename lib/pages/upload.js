"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_1 = __importDefault(require("cookie"));
const config_1 = require("../config");
const auth_1 = require("../auth");
const UNAUTHORIZED = ({
    statusCode: 200,
    head: {
        'Content-Type': 'Application/Javascript',
    },
    body: JSON.stringify({
        error: 'Unauthorized',
    }),
});
const INVALID_JSON = ({
    statusCode: 200,
    head: {
        'Content-Type': 'Application/Javascript',
    },
    body: JSON.stringify({
        error: 'Invalid JSON',
    }),
});
const UPLOAD_SUCCESS = ({
    statusCode: 200,
    head: {
        'Content-Type': 'Application/Javascript',
    },
    body: JSON.stringify({
        error: null,
        success: true,
    }),
});
function upload(request) {
    if (!request.head.cookie)
        return UNAUTHORIZED;
    const { session, } = cookie_1.default.parse(request.head.cookie);
    if (!session)
        return UNAUTHORIZED;
    const user = auth_1.validateSession(session);
    if (!user)
        return UNAUTHORIZED;
    try {
        const req = JSON.parse(request.body.toString());
        if (typeof req !== 'object')
            return INVALID_JSON;
        if (!req.path || !req.hash)
            return INVALID_JSON;
        if (req.hash?.length !== 64)
            return INVALID_JSON;
        if (!req.hash.match(/^[0-9a-f]$/))
            return INVALID_JSON;
        const parts = req.path.toLowerCase().replace(/[^a-z0-9\/\.]+/ig, '-').split('/').filter((a) => a);
        if (parts[0] !== user)
            parts.unshift(user);
        let fn = parts.pop();
        let dir = config_1.files;
        for (const part of parts) {
            dir = dir.__getField(part);
        }
        dir.__set(fn, req.hash);
        return UPLOAD_SUCCESS;
    }
    catch (e) {
        return INVALID_JSON;
    }
}
exports.default = upload;
module.exports = upload;
