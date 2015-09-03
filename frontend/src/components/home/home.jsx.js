import React from 'react/addons';
import {Link} from 'react-router';

let Home = React.createClass({

  render() {

    return (
      <div className="homePage">
        <p>This is the home page</p>
        <Link to='sprint'>Sprint</Link>
      </div>
    );
  }

});

export default Home;
