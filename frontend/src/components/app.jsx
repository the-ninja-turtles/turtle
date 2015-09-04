// for refactoring, compare with authentication example here:
// https://github.com/auth0/auth0-react/blob/gh-pages/examples/redirect-lock-with-api/app.jsx

import React from 'react/addons';
import {RouteHandler, Navigation} from 'react-router';
import lockGenerator from '../auth/lock-generator';
import Home from './home/home.jsx';

let App = React.createClass({
  mixins: [Navigation],

  componentWillMount() {
    this.lock = lockGenerator();
    this.setState(
      {
        idToken: localStorage.getItem('userToken'),
        userProfile: localStorage.getItem('userProfile')
      }
    );
  },

  onLogin() {
    this.setState({
      idToken: localStorage.getItem('userToken')
    });
    this.transitionTo('dashboard');
  },

  render() {
    if (this.state.idToken) {
      return (
        <div className='app'>
          <RouteHandler/>
        </div>
      );
    } else {
      return (
        <Home lock={this.lock} onLogin={this.onLogin} />
      );
    }
  }

});

export default App;
