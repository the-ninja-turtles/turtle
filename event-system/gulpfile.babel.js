import path from 'path';
import gulp from 'gulp';
import {npmInstall} from '../gulp/tools.js';

gulp.task('event-system:install', () => {
  return npmInstall(__dirname);
});

gulp.task('event-system:test', () => {
  let tape = require('gulp-tape');
  return gulp.src(path.join(__dirname, 'tests/*.js'))
    .pipe(tape());
});

gulp.task('event-system:build', () => {
  console.log('building event system');
});
