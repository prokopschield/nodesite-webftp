import server from './server';

import serve from './serve';

import {
	authenticate,
	upload,
} from './pages';

server.hook('/', serve);
server.hook('/authenticate', authenticate);
server.hook('/upload', upload);
