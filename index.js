const walkSync = function(dir, filelist) {
  var path = path || require('path');
  var fs = fs || require('fs'),
      files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      filelist.push(file);
    }
  });
  return filelist;
};
const ejs = require('ejs');
let cwd = process.cwd();
const path = require('path')
const fs = require('fs');

/**
 * Walk templates directory and compile
 */

module.exports = (compileDirectory,data) => {
	if(compileDirectory) {
		cwd = compileDirectory;
	}
	if(typeof data === 'undefined' || typeof data !== 'object') {
		return `data parameter must be an object, even if it is empty.`;
	}
	const templatesPath = path.join(cwd, 'templates');
	const templateFilePaths = walkSync(templatesPath, []);
	const outputDirectory = path.join(cwd, 'build');
	templateFilePaths.forEach((tmplPath) => {
		var newFileName = tmplPath.split('.')[0] + '.html';
		let text = fs.readFileSync(path.join(templatesPath, tmplPath)).toString();
		let templateHTML = ejs.render(text, data)
		fs.writeFile(path.join(outputDirectory, newFileName), templateHTML, 'utf8', (err) => {
			if(err) {
				return console.log(err);
			}
		});
	});
}
