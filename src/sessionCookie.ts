import cookie from 'cookie';
import { validateSession } from './auth';

export default function sessionCookie(cookieString: string): string | false {
	if (!cookieString) return false;
	const { session } = cookie.parse(cookieString);
	if (!session) return false;
	const user = validateSession(session);
	return user || false;
}
module.exports = sessionCookie;
