import path from 'path';
import gulp from 'gulp';
import requiredir from 'requiredir';
import test from '../gulp/test.js';

global.paths = {
  jsEntry: path.join(__dirname, 'src/main.jsx'),
  serverEntry: path.join(__dirname, 'server/server.js'),
  cssEntry: path.join(__dirname, 'src/styles.css'),
  js: [path.join(__dirname, 'src/**/*.js'), path.join(__dirname, 'src/**/*.jsx')],
  styles: path.join(__dirname, 'src/**/*.css'),
  images: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico'].map((ext) => {
    return path.join(__dirname, 'src/**/*' + ext);
  }),
  node_modules: path.join(__dirname, 'node_modules'),
  views: path.join(__dirname, 'server/**/*.ejs'),
  dist: path.join(__dirname, 'dist'),
  public: path.join(__dirname, 'dist/public')
};

gulp.task('frontend:test', test.bind(null, __dirname));

requiredir(path.join(__dirname, 'gulp'));
