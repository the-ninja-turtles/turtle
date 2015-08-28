'use strict';

let gulp = require('gulp');
let eslint = require('gulp-eslint');

gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!**/config.js', '!**/node_modules/**/*.js', '!**/jspm_packages/**/*.js'])
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('test', ['lint']);
