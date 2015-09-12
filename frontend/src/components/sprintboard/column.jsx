import React from 'react';
import {DropTarget} from 'react-dnd';
import {SprintActions} from '../../actions/actions';
import Task from '../tasks/task.jsx';

const columnTarget = {
  hover(props, monitor) {
    // props are the properties of SprintColumn component
    let task = monitor.getItem();
    let newStatus = props.id;
    // if hover event occurs over an empty column region (not over task)
    // and the column is different from the one that the task is dragged from
    // activate action that will push the task in the column array
    if (monitor.isOver({ shallow: true })) {
      SprintActions.updateTaskStatusLocally({taskId: task.id, newStatus: newStatus});
    }
  },

  drop(props, monitor) {
    // props are the properties of SprintColumn component
    let task = monitor.getItem();
    let newStatus = props.id;
    // if the column is different from the one that the task is dragged from
    // update the task’s status
    if (task.status !== props.id) {
      SprintActions.updateTaskStatusOnServer({taskId: task.id, newStatus: newStatus});
      SprintActions.reorderTasksOnServer();
    }
  }
};

let collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget()
  };
};

let SprintColumn = React.createClass({

  render() {
    let tasks = this.props.tasks || [];
    tasks = tasks.map((task) => {
      return (
        <Task
          key={task.id}
          id={task.id}
          name={task.name}
          description={task.description}
          score={task.score}
          status={task.status}
          user={task.user}
          isOnSprintboard={true}
        />
      );
    });

    const {connectDropTarget} = this.props;
    return connectDropTarget(
      <div className='sprint-column'>
        <p className='column-name'>{this.props.columnName}</p>
        {tasks}
      </div>
    );
  }

});

export default DropTarget('task', columnTarget, collect)(SprintColumn);
