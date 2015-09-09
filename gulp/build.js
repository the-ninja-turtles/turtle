import path from 'path';
import gulp from 'gulp';
import babel from 'gulp-babel';

export default (dir) => {
  process.env.BABEL_ENV = 'production';

  return gulp.src(path.join(dir, 'src/**/*.js'))
    .pipe(babel())
    .pipe(gulp.dest(path.join(dir, 'dist')));
};
