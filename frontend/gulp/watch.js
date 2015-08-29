'use strict';

import gulp from 'gulp';

// Watch for file changes and re-build files
gulp.task('frontend:watch', () => {
  gulp.watch([global.paths.mainstylefile, global.paths.styles], ['frontend:buildcss']);
  gulp.watch(global.paths.scripts, ['frontend:buildjs']);
  gulp.watch(global.paths.html, ['frontend:buildhtml']);
  gulp.watch(global.paths.images, ['frontend:buildimg']);
});
