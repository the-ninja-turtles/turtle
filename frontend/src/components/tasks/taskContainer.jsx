import _ from 'lodash';
import React from 'react';
import {DropTarget} from 'react-dnd';
import Task from './task.jsx';
import {TaskContainerActions} from '../../actions/actions.js';

const target = {
  hover(props, monitor) {
    let drag = {
      taskId: monitor.getItem().id,
      tasks: props.tasks
    };
    if (monitor.isOver({ shallow: true })) {
      TaskContainerActions.addTaskToContainerLocally(drag);
    }
  },

  drop(props, monitor) {
    let drag = {
      taskId: monitor.getItem().id,
      tasks: props.tasks
    };
    TaskContainerActions.addTaskToContainerOnServer(drag);
  }
};

let collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget()
  };
};

let TaskContainer = React.createClass({
  propTypes: {
    projectId: React.PropTypes.number.isRequired,
    users: React.PropTypes.array.isRequired,
    tasks: React.PropTypes.array.isRequired
  },

  render() {
    let tasks = this.props.tasks || [];
    tasks = tasks.map((task) => {
      let user = _.findWhere(this.props.users, {id: task.userId});
      return (<Task key={task.id} id={task.id} name={task.name} description={task.description} score={task.score} user={user} />);
    });

    const {connectDropTarget} = this.props;
    return connectDropTarget(
      <div className='task-container'>{tasks}</div>
    );
  }

});

export default DropTarget('task', target, collect)(TaskContainer);
