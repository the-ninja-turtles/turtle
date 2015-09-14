import _ from 'lodash';
import React from 'react';
import TaskContainer from '../tasks/taskContainer.jsx';

let NextSprint = React.createClass({

  score() {
    return _.reduce(this.props.tasks, (acc, task) => {
      return acc + task.score;
    }, 0);
  },

  render() {
    return (
      <div className='fill'>
        <header className='task-container-header'>
          <h1 className='left'>Next sprint</h1>
          <span className='info-block right'>
            <span className='info-block-label'>Score</span>
            <span className='info-block-value'>{this.score()}</span>
          </span>
          <div className='clearfix'></div>
        </header>
        <TaskContainer tasks={this.props.tasks} users={this.props.users}
          empty='Drag tasks from the backlog to assign them to this sprint'/>
      </div>
    );
  }

});

export default NextSprint;
