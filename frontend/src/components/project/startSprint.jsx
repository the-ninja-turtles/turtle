import React from 'react';
import {Navigation} from 'react-router';
import {ProjectActions} from '../../actions/actions.js';

let StartSprint = React.createClass({

  mixins: [Navigation],

  startSprint() {
    ProjectActions.startSprint(() => {
      this.transitionTo('sprint', {id: this.props.project});
    });
  },

  render() {
    return (
      <div className='start-sprint'>
        <button className='btn block primary' onClick={this.startSprint}>Start sprint</button>
      </div>
    );
  }

});

export default StartSprint;
