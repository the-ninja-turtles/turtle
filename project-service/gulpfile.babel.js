import path from 'path';
import gulp from 'gulp';
import {npmInstall} from '../gulp/tools.js';

gulp.task('project-service:install', () => {
  return npmInstall(__dirname);
});

gulp.task('project-service:test', () => {
  let shell = require('gulp-shell');
  return gulp.src(path.join(__dirname, 'tests/**/*Spec.js'))
    .pipe(shell([
      '<%= f(babelNode()) %> <%= f(file.path) %> | <%= f(tapSpec()) %>'
    ], {
      templateData: {
        f: (s) => {
          return s.replace(/ /g, '\\ '); // escape spaces in filepath
        },
        tapSpec: () => {
          return path.join(__dirname, 'node_modules/tap-spec/bin/cmd.js');
        },
        babelNode: () => {
          return path.join(__dirname, 'node_modules/babel/bin/babel-node.js');
        }
      }
    }));
});
