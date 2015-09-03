import gulp from 'gulp';
import install from '../gulp/install.js';
import test from '../gulp/test.js';
import build from '../gulp/build.js';

gulp.task('project-service:install', () => {
  return install(__dirname);
});

gulp.task('project-service:test', () => {
  return test(__dirname);
});

gulp.task('project-service:build', () => {
  return build(__dirname);
});
