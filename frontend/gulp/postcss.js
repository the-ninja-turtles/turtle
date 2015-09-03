import gulp from 'gulp';
import postcss from 'gulp-postcss';
import normalizeCSS from 'postcss-normalize';
import nested from 'postcss-nested';
import atImport from 'postcss-import';
import autoprefixer from 'autoprefixer-core';
import csswring from 'csswring';

gulp.task('frontend:build:css', () => {
  let processors = [
    normalizeCSS,
    atImport,
    nested,
    autoprefixer,
    csswring
  ];
  return gulp.src(global.paths.cssEntry)
    .pipe(postcss(processors))
    .pipe(gulp.dest(global.paths.public));
});
