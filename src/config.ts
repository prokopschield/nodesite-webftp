import { getConfig } from 'doge-config';
const { blake2sHex } = require('blakejs');
import path from 'path';

const config = getConfig('nodesite-webftp', {
	domain: `ftp-${Math.floor(Math.random() * 10000)}`,
	salt: 'Changing this value will invalidate all credentials: ' + blake2sHex('' + new Date + Math.random()),
	folder: path.resolve('.'),
	hidden: [
		'config/nodesite-webftp.json',
	],
	files: {},
	users: {},
	allowUserCreation: true,
	username: process.env.user || process.env.username || process.env.name || 'root',
	lang: {
		INDEX_OF: 'Index of %s',
		PARENT_DIRECTORY: '<< Parent Directory >>',
	},
});

if (!config.__getString('password')) {
	const password = blake2sHex(config.__getString('salt') + new Date + Math.random()).substr(0, 16);
	const hashedPassword = blake2sHex(config.__getString('salt') + password);
	config.__set('password', hashedPassword);
	console.log(
		`Default credentials:\r\n`,
		`Username: ${config.__getString('username')}\r\n`,
		`Password: ${password}\r\n`,
	);
}

export default config;
export const domain = config.__getString('domain');
export const files = config.__getField('files');
export const folder = config.__getString('folder');
export const hidden = config.__getField('hidden');
export const salt = config.__getString('salt');
export const username = config.__getString('username');
export const password = config.__getString('password');
export const users = config.__getField('users');
module.exports = config;
