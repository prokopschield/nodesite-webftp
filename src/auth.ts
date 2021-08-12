import { blake2sHex } from 'blakets';

import config, {
	username as rootUser,
	password as rootPassword,
	users,
	salt,
} from './config';

export function authenticate(username: string, password: string): boolean {
	if (typeof username !== 'string') return false;
	if (typeof password !== 'string') return false;
	username = username.toLowerCase().replace(/[^a-z0-9]/g, '');
	if (password.length !== 64) {
		password = blake2sHex(salt + password);
	}
	if (username === rootUser) {
		return rootPassword === password;
	} else {
		return (
			users.__has(username) &&
			users.__getField(username).__getString('password') === password
		);
	}
}

export function createUser(username: string, password: string): boolean {
	if (!config.__getBoolean('allowUserCreation')) return false;
	if (typeof username !== 'string') return false;
	if (typeof password !== 'string') return false;
	username = username.toLowerCase().replace(/[^a-z0-9]/g, '');
	if (password.length !== 64) {
		password = blake2sHex(salt + password);
	}
	if (!username) return false;
	if (username === rootUser) return false;
	if (users.__has(username)) return false;
	users.set(username, {
		username,
		password,
	});
	return true;
}

export const sessions: {
	[session: string]: string;
} = {};

export function createSession(
	username: string,
	password: string
): string | false {
	if (!authenticate(username, password)) return false;
	const session = blake2sHex('' + new Date() + Math.random() + username);
	sessions[session] = username;
	return session;
}

export function validateSession(session: string): string | undefined {
	return sessions[session];
}
