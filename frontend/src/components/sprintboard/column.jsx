import React from 'react';
import {SprintActions} from '../../actions/actions';
import Task from './task.jsx';

import {ItemTypes} from '../../constants/dragAndDropConstants';
import {DropTarget} from 'react-dnd';

const columnTarget = {
  drop(props, monitor) {
    // props are the properties of SprintColumn component
    let task = monitor.getItem();
    let newStatus = props.columnName;
    SprintActions.updateTaskStatus({taskId: task.id, newStatus: newStatus});
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
      if (task.status === this.props.columnName) {
        return (
          <Task
            key={task.id}
            id={task.id}
            name={task.name}
            description={task.description}
            score={task.score}
            assignedUser={task.user}
          />
        );
      }
    });
    const {connectDropTarget} = this.props;
    return connectDropTarget(
      <div className='sprint-column'>
        <p className='columnName'>{this.props.columnName}</p>
        {tasks}
      </div>
    );
  }

});

export default DropTarget(ItemTypes.SPRINTTASK, columnTarget, collect)(SprintColumn);
