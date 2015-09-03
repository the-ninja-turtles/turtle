import gulp from 'gulp';
import test from '../gulp/test.js';
import build from '../gulp/build.js';

gulp.task('event-system:test', test.bind(null, __dirname));
gulp.task('event-system:build', build.bind(null, __dirname));
