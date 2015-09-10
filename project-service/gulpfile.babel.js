import gulp from 'gulp';
import test from '../gulp/test.js';
import watch from '../gulp/watch.js';
import build from '../gulp/build.js';

gulp.task('project-service:test', test.bind(null, __dirname));
gulp.task('project-service:watch', watch.bind(null, __dirname));
gulp.task('project-service:build', build.bind(null, __dirname));
