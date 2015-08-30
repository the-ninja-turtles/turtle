'use strict';

import gulp from 'gulp';
import path from 'path';
let imagemin = require('gulp-imagemin');
import minifyHtml from 'gulp-minify-html';
import replace from 'gulp-replace';
import runSeq from 'run-sequence';
import postcss from 'gulp-postcss';
import nested from 'postcss-nested';
import atImport from 'postcss-import';
import autoprefixer from 'autoprefixer-core';
import csswring from 'csswring';
import jspm from 'jspm';


// One build task to rule them all.
gulp.task('frontend:build', (done) => {
  runSeq('frontend:clean', ['frontend:buildjs', 'frontend:buildcss', 'frontend:buildhtml', 'frontend:buildimg'], done);
});

gulp.task('frontend:buildjs', () => {
  let jspmPackageDir = path.join(__dirname, '..');
  jspm.setPackagePath(jspmPackageDir);
  let builder = new jspm.Builder();
  // builder.config({ custom: 'options' });

  return builder.buildSFX('src/main.jsx', 'frontend/dist/app.min.js',
    {sourceMaps: true, minify: true}
  );
});

// Build CSS using PostCSS
gulp.task('frontend:buildcss', () => {
  let processors = [
    atImport({from: global.paths.mainstylefile}), // allows import of css files in other css files
    nested, // allows style nesting
    autoprefixer, // adds prefixes to css not supported by all browsers
    csswring // minifies css
  ];
  return gulp.src(global.paths.mainstylefile)
    .pipe(postcss(processors))
    .pipe(gulp.dest(global.paths.destination));
});

// Build HTML for distribution.
gulp.task('frontend:buildhtml', () => {
  return gulp.src(global.paths.html)
    // .pipe(replace('css/app.css', 'app.min.css'))
    .pipe(replace('jspm_packages/system.js', 'app.min.js'))
    .pipe(replace('<script src="config.js"></script>', ''))
    .pipe(replace("<script>System.import('./src/main.jsx');</script>", ''))
    .pipe(minifyHtml())
    .pipe(gulp.dest(global.paths.destination));
});

// Build images for distribution.
gulp.task('frontend:buildimg', () => {
  gulp.src(global.paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest(global.paths.destination + '/images'));
});
