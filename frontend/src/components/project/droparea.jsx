import React from 'react';
import {ProjectActions} from '../../actions/actions';
import Task from './task.jsx';

import {ItemTypes} from '../../constants/dragAndDropConstants';
import {DropTarget} from 'react-dnd';

const dropareaTarget = {
  // this event will happen frequently, on any movement while hovering
  // over the droparea
  hover(props, monitor) {
    const taskId = monitor.getItem().id;
    ProjectActions.addTaskToNextSprintLocally(taskId);
  },

  drop(props, monitor) {
    const taskId = monitor.getItem().id;
    ProjectActions.addTaskToNextSprintOnServer(taskId);
  }
};

let collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget()
  };
};

let Droparea = React.createClass({

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
        />
      );
    });

    const {connectDropTarget} = this.props;
    return connectDropTarget(
      <div className='drop-area'>
        {tasks}
      </div>
    );
  }

});

// export default Droparea;
export default DropTarget(ItemTypes.PROJECTTASK, dropareaTarget, collect)(Droparea);
