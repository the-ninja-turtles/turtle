import React from 'react/addons';
import Reflux from 'reflux';

import Actions from './actions/actions';
import HelloStore from './stores/helloStore';

import HelloWorld from './components/hello.jsx';

let App = React.createClass({
  mixins: [
    Reflux.listenTo(HelloStore, 'onStoreUpdate')
  ],

  getInitialState() {
    return {
      addressee: 'world'
    };
  },

  onStoreUpdate(addressee) {
    this.setState({
      addressee: addressee
    });
  },

  magicFunction() {
    Actions.addresseeUpdate();
    // this.setState({
    //   addressee: "dudes"
    // });
  },

  render() {
    return (
      <div>
        <HelloWorld
          addressee={this.state.addressee}
          onClick={this.magicFunction}
        />
      </div>
    );
  }

});

React.render(<App />, document.getElementById('app'));
