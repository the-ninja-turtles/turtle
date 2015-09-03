import React from 'react/addons';
import {RouteHandler, Link} from 'react-router';

console.log('hello');
let App = React.createClass({
  render: () => {
    return (
      <div className='appContainer'>
        <RouteHandler/>
        <Link to='sprint'>Sprint</Link>
      </div>
    );
  }
});

export default App;
