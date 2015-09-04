import React from 'react/addons';
import {Link, Navigation} from 'react-router';

let Home = React.createClass({
  mixins: [Navigation],

  login(e) {
    e.preventDefault();
    if (localStorage.getItem('userToken')) {
      this.transitionTo('dashboard');
    } else {
      this.showLock();
    }
  },

  showLock(e) {
    // setup lock using these instructions:
    // https://auth0.com/docs/libraries/lock/types-of-applications#single-page-app

    this.props.lock.show({
      authParams: {
        scope: 'openid name email user_id nickname picture'
      }},
      (err, profile, id_token) => {
        if (err) {
          console.log('There was an error :/', err);
          return;
        }
        localStorage.setItem('userToken', id_token);
        localStorage.setItem('userProfile', profile);
        this.props.onLogin();
      });

    // PERHAPS REFACTOR LATER USING AUTH0 WITH REDIRECT METIOD
    // (WILL NEED TO BE PERFORMED NOT ON THE ROOT PAGE):

    // let hash = this.props.lock.parseHash();
    //
    // if (hash) {
    //   if (hash.error) {
    //     console.log('There was an error logging in', hash.error);
    //   } else {
    //     this.props.lock.getProfile(hash.id_token, (err, profile) => {
    //       if (err) {
    //         console.log('Cannot get user :(', err);
    //         return;
    //       }
    //       console.log('Hey dude', profile);
    //     });
    //   }
    // }
    //
    // this.props.lock.show();
  },

  render() {
    return (
      <div className='homePage'>
        <p>This is the home page!!!</p>
        <Link to='sprint'>Sprint</Link> <br />
        <a href='' onClick={this.login}>Sign In</a>
      </div>
    );
  }

});

export default Home;
