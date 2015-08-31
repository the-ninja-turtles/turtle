import npm from 'npm';

export let npmInstall = (dir) => {
  return new Promise((resolve) => {
    npm.load(() => {
      npm.prefix = dir;
      npm.install(resolve);
    });
  });
};
