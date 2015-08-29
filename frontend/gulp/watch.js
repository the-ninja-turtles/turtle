import gulp from 'gulp';

gulp.task('frontend:watch', () => {
  gulp.watch([global.paths.mainstylefile, global.paths.styles], ['frontend:build:css']);
  gulp.watch(global.paths.scripts, ['frontend:build:js']);
  gulp.watch(global.paths.html, ['frontend:build:html']);
  gulp.watch(global.paths.images, ['frontend:build:img']);
});
