import path from 'path';
import gulp from 'gulp';
import tape from 'gulp-tape';

gulp.task('frontend:test', () => {
  return gulp.src(path.join(__dirname, '../tests/*.js'))
    .pipe(tape());
});
