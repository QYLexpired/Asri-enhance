const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const filesToPack = [
	'index.js',
	'index.css',
	'README.md',
	'README_zh_CN.md',
	'i18n',
	'icon.png',
	'plugin.json',
	'preview.png'
];
const outputPath = path.join(__dirname, 'package.zip');
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
	zlib: { level: 9 }
});
archive.on('error', (err) => {
	throw err;
});
archive.pipe(output);
filesToPack.forEach(file => {
	const filePath = path.join(__dirname, file);
	if (fs.existsSync(filePath)) {
		const stat = fs.statSync(filePath);
		if (stat.isDirectory()) {
			archive.directory(filePath, file);
		} else {
			archive.file(filePath, { name: file });
		}
	}
});
archive.finalize();
