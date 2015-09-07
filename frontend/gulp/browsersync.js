import gulp from 'gulp';
import browserSync from 'browser-sync';

gulp.task('frontend:watch', ['watchify'], () => {
  browserSync({
    proxy: {
      target: 'localhost:8080'
    },
    port: 3100,
    ui: false
  });

  gulp.watch(global.paths.styles, ['frontend:watch:css']);
  gulp.watch(global.paths.images, ['frontend:watch:img']);
});

let reload = () => {
  setTimeout(() => {
    browserSync.reload();
  }, 100);
};

gulp.task('frontend:watch:css', ['frontend:build:css'], reload);
gulp.task('frontend:watch:img', ['frontend:build:img'], reload);
