import rewriteHead from './rewriteHead';
import server from './server';

import serve from './serve';

import { authenticate, upload } from './pages';

server.hook('/', serve);
server.hook('/authenticate', authenticate);
server.hook('/upload', upload);

server.hook('/download', (r) =>
	rewriteHead(r, {
		'Content-Type': 'application/octet-stream',
	})
);

server.hook('/plain', (r) =>
	rewriteHead(r, {
		'Content-Type': 'text/plain',
	})
);
