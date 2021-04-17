"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_1 = __importDefault(require("cookie"));
const auth_1 = require("./auth");
function sessionCookie(cookieString) {
    if (!cookieString)
        return false;
    const { session, } = cookie_1.default.parse(cookieString);
    if (!session)
        return false;
    const user = auth_1.validateSession(session);
    return user || false;
}
exports.default = sessionCookie;
module.exports = sessionCookie;
