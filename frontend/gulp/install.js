import gulp from 'gulp';
import jspm from 'jspm';
import path from 'path';
import install from 'gulp-install';

// Install jspm and npm packages required by the frontend
gulp.task('frontend:install', () => {
  let jspmPackageDir = path.join(__dirname, '..');
  jspm.setPackagePath(jspmPackageDir);
  return jspm.install(true, { lock: true }) // first install jspm packages
    .then(() => { // then install npm packages
      gulp.src(path.join(__dirname, '../package.json'))
        .pipe(install());
    });
});
