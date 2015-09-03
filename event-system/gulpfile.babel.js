import gulp from 'gulp';
import install from '../gulp/install.js';
import test from '../gulp/test.js';
import build from '../gulp/build.js';

gulp.task('event-system:install', () => {
  return install(__dirname);
});

gulp.task('event-system:test', () => {
  return test(__dirname);
});

gulp.task('event-system:build', () => {
  return build(__dirname);
});
