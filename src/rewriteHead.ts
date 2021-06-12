import {
	NodeSiteRequest,
	rewrite,
} from "nodesite.eu";
import Uncased from 'uncased';

export async function rewriteHead (request: NodeSiteRequest, headers: {
	[header: string]: string;
}) {
	request.uri = '/' + request.uri.split(/[\\\/]+/g).slice(2).join('/');
	const rres = await rewrite(request, '.');
	const res = ((typeof rres === 'string') || (rres instanceof Buffer)) ? ({
		body: rres,
	}): rres;
	const head = new Uncased(res.head || {});
	head.add(headers);
	res.head = ({ ...head.str });
	return res;
}

export default rewriteHead;
module.exports = rewriteHead;

Object.assign(rewriteHead, {
	default: rewriteHead,
	rewriteHead,
});
