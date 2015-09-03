import path from 'path';
import glob from 'glob';
import tape from 'blue-tape';
import spec from 'tap-spec';

export default (dir) => {
  let stream = tape.createStream()
    .pipe(spec())
    .pipe(process.stdout);

  glob.sync(path.join(dir, 'tests/**/*Spec.js')).forEach((file) => {
    require(path.resolve(file));
  });

  return stream;
};
