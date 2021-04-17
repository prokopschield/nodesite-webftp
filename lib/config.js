"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.password = exports.username = exports.salt = exports.folder = exports.files = exports.domain = void 0;
const doge_config_1 = require("doge-config");
const { blake2sHex } = require('blakejs');
const path_1 = __importDefault(require("path"));
const config = doge_config_1.getConfig('nodesite-webftp', {
    domain: `ftp-${Math.floor(Math.random() * 10000)}`,
    salt: 'Changing this value will invalidate all credentials: ' + blake2sHex('' + new Date + Math.random()),
    folder: path_1.default.resolve('.'),
    allowUserCreation: true,
    username: process.env.user || process.env.username || process.env.name || 'root',
});
if (!config.__getString('password')) {
    const password = blake2sHex(config.__getString('salt') + new Date + Math.random()).substr(0, 16);
    const hashedPassword = blake2sHex(config.__getString('salt') + password);
    config.__set('password', hashedPassword);
    console.log(`Default credentials:\r\n`, `Username: ${config.__getString('username')}\r\n`, `Password: ${password}\r\n`);
}
exports.default = config;
exports.domain = config.__getString('domain');
exports.files = config.__getField('files');
exports.folder = config.__getString('folder');
exports.salt = config.__getString('salt');
exports.username = config.__getString('username');
exports.password = config.__getString('password');
exports.users = config.__getField('users');
module.exports = config;
