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
      <div className='vertical-flex-container'>
        <header className='task-container-header'>
          <h1 className='left'>Next Sprint</h1>
          <div className='info-block'>
            <span className='info-block-value'>{this.score()}</span>
          </div>
          <div className='clearfix'></div>
        </header>
        <TaskContainer tasks={this.props.tasks} users={this.props.users}
          empty='Drag tasks from the backlog to assign them to this sprint'/>
      </div>
    );
  }

});

export default NextSprint;
