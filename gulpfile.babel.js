/*eslint no-unused-vars: 0*/
import gulp from 'gulp';
import eslint from 'gulp-eslint';

import frontendTasks from './frontend/gulpfile.babel.js';
import eventSystemTasks from './event-system/gulpfile.babel.js';

gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!**/config.js', '!**/node_modules/**/*.js', '!**/jspm_packages/**/*.js'])
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('install', ['frontend:install', 'event-system:install']);
gulp.task('test', ['frontend:test', 'event-system:test']);
gulp.task('build', ['frontend:build', 'event-system:build']);

gulp.task('default', ['lint', 'test']);
