import React from 'react';
import Reflux from 'reflux';
import {Navigation} from 'react-router';

let StartSprint = React.createClass({

  mixins: [Navigation, Reflux.ListenerMixin],

  openSprintboard() {
    this.transitionTo('sprint', {id: this.props.project});
  },

  startSprint() {
    this.openSprintboard();
  },

  render() {
    return (
      <div className='start-sprint'>
        <button className='btn primary' onClick={this.startSprint}>Start sprint</button>
      </div>
    );
  }

});

export default StartSprint;
