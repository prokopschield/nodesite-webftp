"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const serve_1 = __importDefault(require("./serve"));
const pages_1 = require("./pages");
server_1.default.hook('/', serve_1.default);
server_1.default.hook('/authenticate', pages_1.authenticate);
server_1.default.hook('/upload', pages_1.upload);
