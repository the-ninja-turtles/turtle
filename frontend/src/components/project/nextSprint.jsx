import React from 'react';
import Reflux from 'reflux';
import {Navigation} from 'react-router';
import TaskContainer from '../tasks/taskContainer.jsx';

let NextSprint = React.createClass({

  mixins: [Navigation, Reflux.ListenerMixin],

  startSprint() {
    this.transitionTo('sprint', {id: this.props.project});
  },

  render() {
    return (
      <div className='next-sprint-info'>
        <h1>Create a new sprint</h1>
        <label className='points'>Points <span className='points-count'>70</span></label>
        <div className='clearfix'></div>
        <label>Name
          <input type='text' />
        </label>
        <label>Start
          <input type='text' />
        </label>
        <label>End
          <input type='text' />
        </label>
        <button className='btn' onClick={this.startSprint}>Start sprint</button>
        <div className='clearfix'></div>
        <TaskContainer tasks={this.props.tasks} users={this.props.users} />
      </div>
    );
  }

});

export default NextSprint;
