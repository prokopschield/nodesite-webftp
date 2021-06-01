import cookie from 'cookie';
import fs from 'fs';
import path from 'path';

import {
	files,
	folder,
	hidden,
} from './config';

import {
	ConfigField
} from 'doge-config';

import {
	AuthenticationPage,
} from './pages/authenticate';

import {
	fileIndex,
} from './pages';

import {
	contentType,
} from 'mime-types';

import {
	ListenerResponse,
	NodeSiteRequest,
} from 'nodesite.eu';

import {
	validateSession,
} from './auth';

function nicepath(parts: string[], filename?: string) {
	return (path.resolve('/', ...parts, filename || '.') + '/').replace(/\/+/g, '/');
}

function serveFile (fspath: string): ListenerResponse {
	const root = path.resolve(folder);
	if (!fspath.includes(root)) return 'Error: accessed file not in allowed directory';
	if (path.resolve(fspath) == path.resolve('./config/nodesite-webftp.json')) return 'Error: You may not read this config file.';
	for (const h of hidden.array) {
		if (fspath.includes(path.resolve(folder, h.toString()))) {
			return 'Error: This file has been hidden.';
		}
	}
	const data = fs.readFileSync(fspath);
	const fn = path.basename(fspath);
	return ({
		statusCode: 200,
		head: {
			'Content-Type': contentType(fn) || 'application/octet-stream',
			'Content-Length': data.length.toString(),
		},
		body: data,
	});
}

export default function serve (request: NodeSiteRequest) {
	if (!request.head.cookie) return AuthenticationPage;
	const {
		session,
	} = cookie.parse(request.head.cookie);
	const user = validateSession(session);
	if (!user) return AuthenticationPage;

	let parts = request.uri.split(/[\\\/]+/g)
	.map(a => decodeURIComponent(a))
	.filter((a: string) => (
		a
		&& !a.includes('..')
	));
	
	let fspath = path.resolve(folder);
	let vspath = files;
	let fsflag = true;
	let vsflag = true;

	const filename = parts.pop() || '.';

	for (const part of parts) {
		let tpath = path.resolve(fspath, part);
		if (fs.existsSync(tpath)) {
			fspath = tpath;
		} else fsflag = false;
		if (vspath.__has(part)) {
			vspath = vspath.__getField(part);
		} else vsflag = false;
	}

	// test for case: /dir/dir/dir/file<--/filename
	const fstat = fs.statSync(fspath);
	if (!fstat.isDirectory()) {
		return serveFile(fspath);
	}

	if (fs.existsSync(fspath = path.resolve(fspath, filename))) {
		const fstat = fs.statSync(fspath);
		if (!fstat.isDirectory()) {
			return serveFile(fspath);
		} else if (vsflag && vspath.__has(filename)) {
			const fsfiles = fs.readdirSync(fspath);
			const files: {
				[index: string]: string | ConfigField
			} = {
				...vspath.__getField(filename),
			}
			for (const file of fsfiles) {
				const stat = fs.statSync(path.resolve(fspath, file));
				if (stat.isDirectory()) {
					files[file + '/'] = `${file}/`;
				} else {
					files[file] = file;
				}
			}
			return fileIndex(nicepath(parts, filename), files);
		} else {
			const files: {
				[index: string]: string | ConfigField
			} = {};
			const fsfiles = fs.readdirSync(fspath);
			for (const file of fsfiles) {
				const stat = fs.statSync(path.resolve(fspath, file));
				if (stat.isDirectory()) {
					files[file + '/'] = `${file}/`;
				} else {
					files[file] = file;
				}
			}
			return fileIndex(nicepath(parts, filename), files);
		}
	}

	if (vspath.__has(filename)) {
		const file = vspath.__get(filename);
		if (file instanceof ConfigField) {
			return fileIndex(nicepath(parts, filename), { ...file });
		} else {
			return ({
				statusCode: 302,
				head: {
					location: `/static/${file}`,
				},
			});
		}
	}

	return fileIndex(nicepath(parts), { ...vspath });
}
