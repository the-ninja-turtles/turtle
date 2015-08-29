import path from 'path';
import gulp from 'gulp';
import install from 'gulp-install';

gulp.task('event-system:install', () => {
  gulp.src(path.join(__dirname, './package.json'))
    .pipe(install());
});

gulp.task('event-system:build', () => {
  console.log('building event system');
});
