"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodesite_eu_1 = require("nodesite.eu");
const config_1 = require("./config");
class Server {
    constructor() {
        this.domain = config_1.domain;
        this.files = config_1.files;
        this.users = config_1.users;
    }
    hook(path, callback) {
        nodesite_eu_1.create(this.domain, path, callback);
    }
}
const server = new Server;
exports.default = server;
module.exports = server;
