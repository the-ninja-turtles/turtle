import gulp from 'gulp';
import test from '../gulp/test.js';
import build from '../gulp/build.js';

gulp.task('invitation-service:test', test.bind(null, __dirname));
gulp.task('invitation-service:build', build.bind(null, __dirname));
