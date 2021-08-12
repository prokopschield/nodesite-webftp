import { create, Listener } from 'nodesite.eu';
import { domain, files, users } from './config';

class Server {
	constructor() {}

	hook(path: string, callback: Listener) {
		create(this.domain, path, callback);
	}

	domain = domain;
	files = files;
	users = users;
}

const server = new Server();

export default server;
module.exports = server;
