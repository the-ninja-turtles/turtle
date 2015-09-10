import path from 'path';
import nodemon from 'gulp-nodemon';

export default (dirname) => {
  let pjson = require(path.join(dirname, 'package.json'));
  nodemon({
    script: path.join(dirname, pjson.main),
    watch: path.join(dirname, 'src/**/*.js'),
    execMap: {
      'js': '../node_modules/babel/bin/babel-node.js'
    }
  });
};
