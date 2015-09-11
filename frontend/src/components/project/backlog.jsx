import React from 'react';
import Task from './task.jsx';
import CreateTask from '../tasks/createTask.jsx';
import {ProjectActions} from '../../actions/actions.js';

import {ItemTypes} from '../../constants/dragAndDropConstants';
import {DropTarget} from 'react-dnd';

const backlogTarget = {
  hover(props, monitor) {
    const taskId = monitor.getItem().id;
    if (monitor.isOver({ shallow: true })) {
      ProjectActions.addTaskToBacklogLocally(taskId);
    }
  },

  drop(props, monitor) {
    const taskId = monitor.getItem().id;
    ProjectActions.addTaskToBacklogOnServer(taskId);
  }
};

let collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget()
  };
};

let Backlog = React.createClass({
  propTypes: {
    projectId: React.PropTypes.number.isRequired,
    users: React.PropTypes.array.isRequired,
    tasks: React.PropTypes.array.isRequired
  },

  getInitialState() {
    return {
      showModal: false
    };
  },

  close() {
    Actions.fetchProject(this.props.projectId);
    this.setState({showModal: false});
  },

  open() {
    this.setState({showModal: true});
  },

  render() {
    let tasks = this.props.tasks || [];
    tasks = tasks.map((task) => {
      return (<Task key={task.id} id={task.id} name={task.name} description={task.description} score={task.score} />);
    });

    const {connectDropTarget} = this.props;
    return connectDropTarget(
      <div className='backlog'>
        <CreateTask
          showModal={this.state.showModal}
          close={this.close}
          projectId={this.props.projectId}
          users={this.props.users} // to be updated
          status='Backlog' // to be updated (?)
          rank={9999} // to be updated
        />

        <h1>Backlog</h1>
        <button className='btn' onClick={this.open}>+ New Task</button>
        <div className='clearfix'></div>
        <div className='tasks'>{tasks}</div>
      </div>
    );
  }

});

export default DropTarget(ItemTypes.PROJECTTASK, backlogTarget, collect)(Backlog);
