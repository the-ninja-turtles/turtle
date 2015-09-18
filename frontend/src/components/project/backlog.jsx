import _ from 'lodash';
import React from 'react';
import TaskContainer from '../tasks/taskContainer.jsx';
import TaskForm from '../tasks/taskForm.jsx';
import {TaskFormActions} from '../../actions/actions.js';

let Backlog = React.createClass({
  propTypes: {
    project: React.PropTypes.number.isRequired,
    users: React.PropTypes.array.isRequired,
    tasks: React.PropTypes.array.isRequired
  },

  score() {
    return _.reduce(this.props.tasks, (acc, task) => {
      return acc + task.score;
    }, 0);
  },

  createTask() {
    TaskFormActions.createTask();
  },

  render() {
    return (
      <div className='vertical-flex-container'>
        <header className='task-container-header'>
          <TaskForm
            project={this.props.project}
            users={this.props.users}
          />
          <h1 className='left'>Backlog</h1>
          <div className='info-block'>
            <span className='info-block-value'>{this.score()}</span>
          </div>
          <button className='btn primary right' onClick={this.createTask}>+ New Task</button>
          <div className='clearfix'></div>
        </header>
        <TaskContainer tasks={this.props.tasks} users={this.props.users} empty='No tasks in your backlog' />
      </div>
    );
  }

});

export default Backlog;
