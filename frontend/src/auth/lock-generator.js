// extracted generation of auth0 lock into its own module,
// because the module 'auth0-lock' requires 'packageify' to work,
// and so may break the workflow if it does not involve a browserify step

let lockGenerator = () => {
  let Auth0Lock = require('auth0-lock');
  let lock = new Auth0Lock('7mdQiLLeKFZ5TlYPsEDOUKGavNWFzWSy', 'turtle.eu.auth0.com');
  return lock;
};

export default lockGenerator;
