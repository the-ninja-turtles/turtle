// to continue building this component,
// see example here: https://github.com/auth0/auth0-react/blob/gh-pages/examples/redirect-lock-with-api/app.jsx

import React from 'react/addons';
import {RouteHandler} from 'react-router';
// the following line caused troubles when using jspm,
// because of the command `Auth0Lock.version = require('package.version');` in the module
// import Auth0Lock from 'auth0-lock';


let App = React.createClass({

  componentWillMount: function() {
    // will need correct cilent_id and namespace (i.e. domain name)
    this.lock = new Auth0Lock('YOUR_CLIENT_ID', 'YOUR_NAMESPACE');
  },

  render: () => {
    return (
      <div className="appContainer">
        <RouteHandler/>
      </div>
    );
  }
});

export default App;
