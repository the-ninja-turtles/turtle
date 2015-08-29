// gulp configuration is inspired by examples from this repository:
// https://github.com/alexweber/es6-jspm-gulp-boilerplate

// import gulp from 'gulp';
import requireDir from 'require-dir';

global.paths = {
  html: './frontend/index.html',
  // currently there aren't any .jsx files, but hopefully later on we will change
  // all jsx.js files to .jsx files
  scripts: ['./frontend/src/**/*.js', './frontend/src/**/*.jsx'],
  images: ['./frontend/src/**/*.jpg', './frontend/src/**/*.png', './frontend/src/**/*.jpeg',
          './frontend/src/**/*.gif', './frontend/src/**/*.svg', './frontend/src/**/*.ico'],
  mainstylefile: './frontend/src/styles.css',
  styles: ['./frontend/src/components/**/*.css'],
  destination: './frontend/dist'
};

// Require all tasks in the 'gulp' folder.
requireDir('./gulp', { recurse: false });

// Default task: watch for changes.
// gulp.task('default', ['frontend:watch']);
