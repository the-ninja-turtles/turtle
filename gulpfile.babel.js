/*eslint no-unused-vars: 0*/
import path from 'path';
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import test from './gulp/test.js';

import frontendTasks from './frontend/gulpfile.babel.js';
import eventSystemTasks from './event-system/gulpfile.babel.js';
import projectServiceTasks from './project-service/gulpfile.babel.js';

gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!**/dist/**/*.js', '!**/node_modules/**/*.js', '!**/jspm_packages/**/*.js'])
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('install', ['frontend:install', 'event-system:install', 'project-service:install']);

gulp.task('test', () => {
  return test(path.join(__dirname, '**'));
});

gulp.task('build', ['frontend:build', 'event-system:build', 'project-service:build']);

gulp.task('default', ['lint', 'test']);
