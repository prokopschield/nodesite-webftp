"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const doge_config_1 = require("doge-config");
function fileIndex(path, files) {
    return (`<!DOCTYPE html>
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
		${((() => {
        const entries = [];
        for (const key in files) {
            const file = files[key];
            if (file instanceof doge_config_1.ConfigField) {
                entries.push([key, key + '/']);
            }
            else if (file[file.length - 1] === '/') {
                entries.push([file, file]);
            }
            else if (file.length === 64) {
                entries.push([key, '/static/' + file]);
            }
            else {
                entries.push([file, file]);
            }
        }
        return entries.map(a => `<li><a href="${a[1]}">${a[0]}</a></li>`).join('');
    })())}
	</ul>
</body>
</html>`);
}
exports.default = fileIndex;
module.exports = fileIndex;
