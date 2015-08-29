import gulp from 'gulp';
import del from 'del';

// Empty the build dir.
gulp.task('frontend:clean', (done) => {
  del([global.paths.destination + '/*'], done);
});
