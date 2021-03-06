import { ConfigField } from 'doge-config';
import { ValidConfigValue } from 'doge-config/lib/types';
import { posix as pathutil } from 'path';
import config from '../config';

const lang = config.obj.lang.str;

export default function fileIndex(
	path: string,
	files: {
		[index: string]: ValidConfigValue;
	}
): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Index of ${path}</title>
</head>
<body>
	<h1>${lang.INDEX_OF.replace('%s', path)}</h1>
	<ul>
		${(() => {
			const entries: string[][] = [
				[
					lang.PARENT_DIRECTORY,
					pathutil.resolve(path, '..').replace(/\/?$/, '/'),
				],
			];
			for (const key in files) {
				const file = files[key] || key;
				if (file instanceof ConfigField) {
					entries.push([key + '/', key + '/']);
				} else if (typeof file !== 'string') {
					entries.push([`${file}`, `${file}`]);
				} else if (file[file.length - 1] === '/') {
					entries.push([file, file]);
				} else if (file.length === 64) {
					entries.push([key, key]);
				} else {
					entries.push([file, file]);
				}
			}
			return entries
				.map(
					(a) => `
<li>
	${lang.TYPE_DELIMETER_LEFT}<a href="/plain${path}${a[1]}">${lang.TYPE_PLAIN}</a>${lang.TYPE_DELIMETER_RIGHT}
	${lang.TYPE_DELIMETER_LEFT}<a href="/download${path}${a[1]}">${lang.TYPE_DOWNLOAD}</a>${lang.TYPE_DELIMETER_RIGHT}
	<a href="${a[1]}">${a[0]}</a>
</li>
`
				)
				.join('');
		})()}
	</ul>
</body>
</html>`;
}
module.exports = fileIndex;
