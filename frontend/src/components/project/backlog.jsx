import React from 'react';
import TaskContainer from '../tasks/taskContainer.jsx';
import CreateTask from '../tasks/createTask.jsx';

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
  },

  open() {
    this.setState({showModal: true});
  },

  render() {
    return (
      <div className='backlog'>
        <CreateTask
            showModal={this.state.showModal}
            close={this.close}
            projectId={this.props.project}
            users={this.props.users}
          />
        <h1 className='left'>Backlog</h1>
        <div className='btn-container right'>
          <button className='btn primary' onClick={this.open}>+ New Task</button>
        </div>
        <div className='clearfix'></div>
        <TaskContainer tasks={this.props.tasks} users={this.props.users} />
      </div>
    );
  }

});

export default Backlog;
