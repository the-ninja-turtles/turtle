import gulp from 'gulp';
import babel from 'gulp-babel';
import imagemin from 'gulp-imagemin';

gulp.task('frontend:build', ['frontend:build:js', 'frontend:build:css', 'frontend:build:img', 'frontend:build:server']);

gulp.task('frontend:build:views', () => {
  return gulp.src(global.paths.views)
    .pipe(gulp.dest(global.paths.dist));
});

gulp.task('frontend:build:server', ['frontend:build:views'], () => {
  return gulp.src(global.paths.serverEntry)
    .pipe(babel())
    .pipe(gulp.dest(global.paths.dist));
});

gulp.task('frontend:build:img', () => {
  gulp.src(global.paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest(global.paths.public));
});
