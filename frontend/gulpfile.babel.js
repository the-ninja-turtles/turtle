import path from 'path';
import gulp from 'gulp';
import {npmInstall} from '../gulp/tools.js';

let prependDirname = (relPath) => {
  return path.join(__dirname, relPath);
};

global.paths = {
  html: prependDirname('index.html'),
  // currently there aren't any .jsx files, but hopefully later on we will change
  // all jsx.js files to .jsx files
  scripts: ['src/**/*.js', 'src/**/*.jsx'].map(prependDirname),
  images: [
    'src/**/*.jpg', 'src/**/*.jpeg',
    'src/**/*.png', 'src/**/*.gif',
    'src/**/*.svg', 'src/**/*.ico'
  ].map(prependDirname),
  mainstylefile: prependDirname('src/styles.css'),
  styles: prependDirname('src/components/**/*.css'),
  destination: prependDirname('dist')
};

// Require all tasks in the 'gulp' folder.
try {
  let requireDir = require('require-dir');
  requireDir('./gulp', { recurse: false });
} catch(e) {
  console.log('please run gulp install');
}

// Default task: watch for changes.
// gulp.task('default', ['frontend:watch']);

gulp.task('frontend:install', () => {
  return npmInstall(__dirname).then(() => {
    let jspm = require('jspm');
    jspm.setPackagePath(__dirname);
    return jspm.install(true, { lock: true });
  });
});
