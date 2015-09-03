// to continue building this component,
// see example here: https://github.com/auth0/auth0-react/blob/gh-pages/examples/redirect-lock-with-api/app.jsx

import React from 'react/addons';
import {RouteHandler} from 'react-router';
import Auth0Lock from 'auth0-lock';

let App = React.createClass({

  componentWillMount: function() {
    this.lock = new Auth0Lock('7mdQiLLeKFZ5TlYPsEDOUKGavNWFzWSy', 'turtle.eu.auth0.com');
  },

  render: () => {
    return (
      <div className='appContainer'>
        <RouteHandler/>
      </div>
    );
  }
});

export default App;
