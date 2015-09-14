import path from 'path';
import gulp from 'gulp';
import postcss from 'gulp-postcss';
import normalizeCSS from 'postcss-normalize';
import nested from 'postcss-nested';
import atImport from 'postcss-import';
import autoprefixer from 'autoprefixer-core';
import csswring from 'csswring';

gulp.task('frontend:build:css', ['frontend:build:css:postcss', 'frontend:build:css:fonts']);

gulp.task('frontend:build:css:postcss', () => {
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

gulp.task('frontend:build:css:fonts', () => {
  return gulp.src(global.paths.node_modules + '/bootstrap/dist/fonts/**.*')
    .pipe(gulp.dest(path.join(global.paths.public, '/fonts')));
});

