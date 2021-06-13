import cookie from 'cookie';
import fs from 'fs';
import {
	files as BaseDirectory,
} from '../config';

import {
	validateSession
} from '../auth';

import {
	ListenerResponse,
	NodeSiteRequest,
} from 'nodesite.eu';

const upload_html = fs.readFileSync('./src/pages/upload.html');

const UNAUTHORIZED = ({
	statusCode: 200,
	head: {
		'Content-Type': 'Application/Javascript',
	},
	body: JSON.stringify({
		error: 'Unauthorized',
	}),
});

const INVALID_JSON = ({
	statusCode: 200,
	head: {
		'Content-Type': 'Application/Javascript',
	},
	body: JSON.stringify({
		error: 'Invalid JSON',
	}),
});

const UPLOAD_SUCCESS = ({
	statusCode: 200,
	head: {
		'Content-Type': 'Application/Javascript',
	},
	body: JSON.stringify({
		error: null,
		success: true,
	}),
});

export default function upload (request: NodeSiteRequest): ListenerResponse {
	if (request.method === 'GET') return upload_html;
	if (!request.head.cookie) return UNAUTHORIZED;
	const {
		session,
	} = cookie.parse(request.head.cookie);
	if (!session) return UNAUTHORIZED;
	const user = validateSession(session);
	if (!user) return UNAUTHORIZED;
	try {
		const req = JSON.parse(request.body.toString());
		if (typeof req !== 'object') return INVALID_JSON;
		if (!req.path || !req.hash) return INVALID_JSON;
		if (req.hash?.length !== 64) return INVALID_JSON;
		if (!req.hash.match(/^[0-9a-f]{64}$/)) return INVALID_JSON;
		const parts = req.path.toLowerCase().replace(/[^a-z0-9\/\.]+/ig, '-').split('/').filter((a: string) => a);
		if (parts[0] !== user) parts.unshift(user);
		let fn = parts.pop();
		let dir = BaseDirectory;
		for (const part of parts) {
			dir = dir.__getField(part);
		}
		dir.__set(fn, req.hash);
		return UPLOAD_SUCCESS;
	} catch (e) {
		return INVALID_JSON;
	}
}
module.exports = upload;
