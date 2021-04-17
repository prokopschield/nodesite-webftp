import { Listener } from 'nodesite.eu';
declare class Server {
    constructor();
    hook(path: string, callback: Listener): void;
    domain: string;
    files: import("doge-config").ConfigField;
    users: import("doge-config").ConfigField;
}
declare const server: Server;
export default server;
