import path from 'path';
import npm from 'npm';
import glob from 'glob';
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import test from './gulp/test.js';

try {
  require('./frontend/gulpfile.babel.js');
  require('./event-system/gulpfile.babel.js');
  require('./project-service/gulpfile.babel.js');
  require('./invitation-service/gulpfile.babel.js');
} catch (err) {
  console.log('please run gulp install first');
}

gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!**/dist/**/*.js', '!**/node_modules/**/*.js'])
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('install', () => {
  return Promise.all(glob.sync('*/package.json', {ignore: '**/node_modules/**/*.json'}).map((file) => {
    return new Promise((resolve) => {
      let dir = path.dirname(path.resolve(file));
      npm.load(() => {
        npm.prefix = dir;
        npm.install(resolve);
      });
    });
  }));
});

gulp.task('test', test.bind(null, '**'));

gulp.task('build', ['frontend:build', 'event-system:build', 'project-service:build', 'invitation-service:build']);

gulp.task('default', ['lint', 'test']);
