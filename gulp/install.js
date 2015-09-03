import npm from 'npm';

export default (dir) => {
  return new Promise((resolve) => {
    npm.load(() => {
      npm.prefix = dir;
      npm.install(resolve);
    });
  });
};
