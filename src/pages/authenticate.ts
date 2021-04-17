import fs from 'fs';
import path from 'path';
import querystring from 'querystring';

import {
	NodeSiteRequest,
	ListenerResponse,
} from 'nodesite.eu';

import {
	createSession, createUser,
} from '../auth';

export const AuthenticationPage: ListenerResponse = (
	() => {
		const html = fs.readFileSync(path.resolve(__dirname, '..', '..', 'src', 'pages', 'authenticate.html'));
		const length = html.length;
		return ({
			statusCode: 200,
			head: {
				'Content-Type': 'text/html',
				'Content-Length': length.toString(),
			},
			body: html,
		});
	}
)();

export default function authenticate (request: NodeSiteRequest): ListenerResponse {
	if (!request.body) return AuthenticationPage;
	const requestBody = (
		(request.body instanceof Buffer)
		? request.body.toString('utf-8')
		: request.body.toString()
	);
	const {
		action,
		username,
		password,
	} = querystring.parse(requestBody);
	if (!username || !password) return AuthenticationPage;
	if (typeof username !== 'string') return AuthenticationPage;
	if (typeof password !== 'string') return AuthenticationPage;
	const session = createSession(username, password);
	return session ? ({
		statusCode: 302,
		head: {
			Location: '/',
			'Set-Cookie': `session=${session}; SameSite=Strict`,
		},
	}) : (
		( ( action === 'Register' ) && createUser(username, password) )
		? authenticate(request)
		: AuthenticationPage
	);
}
module.exports = authenticate;
module.exports.AuthenticationPage = AuthenticationPage;
