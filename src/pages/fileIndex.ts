import { ConfigField } from "doge-config";
import { ValidConfigValue } from "doge-config/lib/types";
import { posix as pathutil } from 'path';

export default function fileIndex (path: string, files: {
	[index: string]: ValidConfigValue;
}): string {
return (
`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Index of ${path}</title>
</head>
<body>
	<h1>Index of ${path}</h1>
	<ul>
		${
			((() => {
				const entries: string[][] = [];
				for (const key in {
					'.': pathutil.resolve(path, '.'),
					'..': pathutil.resolve(path, '..'),
					...files,
				}) {
					const file = files[key] || key;
					if (file instanceof ConfigField) {
						entries.push([key, key + '/']);
					} else if (typeof file !== 'string') {
						entries.push([`${file}`, `${file}`]);
					} else if (file[file.length - 1] === '/') {
						entries.push([file, file]);
					} else if (file.length === 64) {
						entries.push([key, '/static/' + file])
					} else {
						entries.push([file, file]);
					}
				}
				return entries.map(a => `<li><a href="${a[1]}">${a[0]}</a></li>`).join('');
			})())
		}
	</ul>
</body>
</html>`
);
}
module.exports = fileIndex;
