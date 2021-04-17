"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSession = exports.createSession = exports.sessions = exports.createUser = exports.authenticate = void 0;
const config_1 = __importStar(require("./config"));
const { blake2sHex } = require('blakejs');
function authenticate(username, password) {
    if (typeof username !== 'string')
        return false;
    if (typeof password !== 'string')
        return false;
    username = username.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (password.length !== 64) {
        password = blake2sHex(config_1.salt + password);
    }
    if (username === config_1.username) {
        return config_1.password === password;
    }
    else {
        return config_1.users.__has(username) && (config_1.users.__getField(username).__getString('password') === password);
    }
}
exports.authenticate = authenticate;
function createUser(username, password) {
    if (!config_1.default.__getBoolean('allowUserCreation'))
        return false;
    if (typeof username !== 'string')
        return false;
    if (typeof password !== 'string')
        return false;
    username = username.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (password.length !== 64) {
        password = blake2sHex(config_1.salt + password);
    }
    if (!username)
        return false;
    if (username === config_1.username)
        return false;
    if (config_1.users.__has(username))
        return false;
    config_1.users.set(username, {
        username,
        password,
    });
    return true;
}
exports.createUser = createUser;
exports.sessions = {};
function createSession(username, password) {
    if (!authenticate(username, password))
        return false;
    const session = blake2sHex('' + new Date + Math.random() + username);
    exports.sessions[session] = username;
    return session;
}
exports.createSession = createSession;
function validateSession(session) {
    return exports.sessions[session];
}
exports.validateSession = validateSession;
