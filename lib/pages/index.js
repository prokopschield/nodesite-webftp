"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.fileIndex = exports.authenticate = void 0;
const authenticate_1 = __importDefault(require("./authenticate"));
exports.authenticate = authenticate_1.default;
const fileIndex_1 = __importDefault(require("./fileIndex"));
exports.fileIndex = fileIndex_1.default;
const upload_1 = __importDefault(require("./upload"));
exports.upload = upload_1.default;
