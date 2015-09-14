import React from 'react';
import TaskContainer from '../tasks/taskContainer.jsx';
import CreateTask from '../tasks/createTask.jsx';
import {ProjectActions} from '../../actions/actions.js';

let Backlog = React.createClass({
  propTypes: {
    project: React.PropTypes.number.isRequired,
    users: React.PropTypes.array.isRequired,
    tasks: React.PropTypes.array.isRequired
  },

  getInitialState() {
    return {
      showModal: false
    };
  },

  close() {
    this.setState({showModal: false});
    ProjectActions.fetchProject(this.props.project);
  },

  open() {
    this.setState({showModal: true});
  },

  render() {
    return (
      <div className='backlog'>
        <CreateTask
          showModal={this.state.showModal}
          project={this.props.project}
          close={this.close}
          users={this.props.users}
        />
        <h1 className='left'>Backlog</h1>
        <div className='btn-container right'>
          <button className='btn primary' onClick={this.open}>+ New Task</button>
        </div>
        <div className='clearfix'></div>
        <TaskContainer tasks={this.props.tasks} users={this.props.users} empty='No tasks in your backlog' />
      </div>
    );
  }

});

export default Backlog;
