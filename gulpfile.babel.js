/*eslint no-unused-vars: 0*/
import gulp from 'gulp';
import tape from 'gulp-tape';
import eslint from 'gulp-eslint';

import eventSystemTasks from './event-system/gulpfile';

gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!**/config.js', '!**/node_modules/**/*.js', '!**/jspm_packages/**/*.js'])
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('tape', () => {
  return gulp.src('*/tests/*.js')
    .pipe(tape());
});

gulp.task('install', ['event-system:install']);
gulp.task('test', ['lint', 'tape']);
gulp.task('build', ['event-system:build']);
