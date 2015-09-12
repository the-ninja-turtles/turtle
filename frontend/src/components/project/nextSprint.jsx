import _ from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import TaskContainer from '../tasks/taskContainer.jsx';

let NextSprint = React.createClass({

  mixins: [Reflux.ListenerMixin],

  score() {
    return _.reduce(this.props.tasks, (acc, task) => {
      return acc + task.score;
    }, 0);
  },

  render() {
    return (
      <div className='next-sprint-info'>
        <h1 className='left'>Next sprint</h1>
        <span className='sprint-score right'>
          <span className='sprint-score-label'>Score</span>
          <span className='sprint-score-score'>{this.score()}</span>
        </span>
        <div className='clearfix'></div>
        <TaskContainer tasks={this.props.tasks} users={this.props.users} />
      </div>
    );
  }

});

export default NextSprint;
