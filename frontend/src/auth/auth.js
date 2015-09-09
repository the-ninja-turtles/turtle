import _ from 'lodash';
import jwt from 'jwt-decode';

class Auth {

  constructor() {
    // delay import of 'auth0-lock' because of dependency on 'packageify'
    let Auth0Lock = require('auth0-lock');
    this.auth0Lock = new Auth0Lock('7mdQiLLeKFZ5TlYPsEDOUKGavNWFzWSy', 'turtle.eu.auth0.com');
    this.options = {
      authParams: {
        scope: 'openid name email user_id nickname picture'
      },
      closable: false
    };
  }

  token() {
    // https://auth0.com/docs/libraries/lock/types-of-applications#single-page-app
    return new Promise((resolve, reject) => {
      let token = localStorage.getItem('userToken');
      if (token && jwt(token).exp * 1000 > Date.now()) {
        return resolve(token);
      }
      this.auth0Lock.show(this.options, (err, profile, token) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          localStorage.setItem('userToken', token);
          resolve(token);
        }
      });
    });
  }

}

export default _.once(() => {
  return new Auth();
});
