'use strict';

let gulp = require('gulp');
let del = require('del');

// Empty the build dir.
gulp.task('frontend:clean', (done) => {
  console.log('inside clean task');
  del([global.paths.destination + '/*'], done);
});
