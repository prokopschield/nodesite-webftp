"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_1 = __importDefault(require("cookie"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const doge_config_1 = require("doge-config");
const authenticate_1 = require("./pages/authenticate");
const pages_1 = require("./pages");
const mime_types_1 = require("mime-types");
const auth_1 = require("./auth");
function nicepath(parts, filename) {
    return (path_1.default.resolve('/', ...parts, filename || '.') + '/').replace(/\/+/g, '/');
}
function serveFile(fspath) {
    const root = path_1.default.resolve('.');
    if (!fspath.includes(root))
        return 'Error: accessed file not in allowed directory';
    if (path_1.default.resolve(fspath) == path_1.default.resolve('./config/nodesite-webftp.json'))
        return 'Error: You may not read this config file.';
    const data = fs_1.default.readFileSync(fspath);
    const fn = path_1.default.basename(fspath);
    return ({
        statusCode: 200,
        head: {
            'Content-Type': mime_types_1.contentType(fn) || 'application/octet-stream',
            'Content-Length': data.length.toString(),
        },
        body: data,
    });
}
function serve(request) {
    if (!request.head.cookie)
        return authenticate_1.AuthenticationPage;
    const { session, } = cookie_1.default.parse(request.head.cookie);
    const user = auth_1.validateSession(session);
    if (!user)
        return authenticate_1.AuthenticationPage;
    let parts = request.uri.split('/').filter((a) => a);
    let fspath = path_1.default.resolve('.');
    let vspath = config_1.files;
    let fsflag = true;
    let vsflag = true;
    const filename = parts.pop() || '.';
    for (const part of parts) {
        let tpath = path_1.default.resolve(fspath, part);
        if (fs_1.default.existsSync(tpath)) {
            fspath = tpath;
        }
        else
            fsflag = false;
        if (vspath.__has(part)) {
            vspath = vspath.__getField(part);
        }
        else
            vsflag = false;
    }
    const fstat = fs_1.default.statSync(fspath);
    if (!fstat.isDirectory()) {
        return serveFile(fspath);
    }
    if (fs_1.default.existsSync(fspath = path_1.default.resolve(fspath, filename))) {
        const fstat = fs_1.default.statSync(fspath);
        if (!fstat.isDirectory()) {
            return serveFile(fspath);
        }
        else if (vsflag && vspath.__has(filename)) {
            const fsfiles = fs_1.default.readdirSync(fspath);
            const files = {
                ...vspath.__getField(filename),
            };
            for (const file of fsfiles) {
                const stat = fs_1.default.statSync(path_1.default.resolve(fspath, file));
                if (stat.isDirectory()) {
                    files[file + '/'] = `${file}/`;
                }
                else {
                    files[file] = file;
                }
            }
            return pages_1.fileIndex(nicepath(parts, filename), files);
        }
        else {
            const files = {};
            const fsfiles = fs_1.default.readdirSync(fspath);
            for (const file of fsfiles) {
                const stat = fs_1.default.statSync(path_1.default.resolve(fspath, file));
                if (stat.isDirectory()) {
                    files[file + '/'] = `${file}/`;
                }
                else {
                    files[file] = file;
                }
            }
            return pages_1.fileIndex(nicepath(parts, filename), files);
        }
    }
    if (vspath.__has(filename)) {
        const file = vspath.__get(filename);
        if (file instanceof doge_config_1.ConfigField) {
            return pages_1.fileIndex(nicepath(parts, filename), { ...file });
        }
        else {
            return ({
                statusCode: 302,
                head: {
                    location: `/static/${file}`,
                },
            });
        }
    }
    return pages_1.fileIndex(nicepath(parts), { ...vspath });
}
exports.default = serve;
