import React, {PropTypes} from 'react/addons';
import {DragSource, DropTarget} from 'react-dnd';
import {TaskActions, SprintActions} from '../../actions/actions.js';

const taskSource = {
  beginDrag(props) {
    // when drag starts, this object will be returned
    // (it contains the task id, so that the dragged task can be identified and updated)
    return {
      id: props.id,
      status: props.status
    };
  }
};

const taskTarget = {
  hover(props, monitor) {
    const draggedId = monitor.getItem().id;
    let drag = {
      draggedTaskId: draggedId,
      targetTaskId: props.id
    };
    if (draggedId !== props.id) {
      if (props.isOnSprintboard) {
        SprintActions.reorderTasksLocally(drag);
      } else {
        TaskActions.updateTaskPosLocally(drag);
      }
    }
  },

  drop(props, monitor) {
    const draggedId = monitor.getItem().id;
    let drag = {
      draggedTaskId: draggedId,
      targetTaskId: props.id
    };
    if (!props.isOnSprintboard) {
      TaskActions.updateTaskPosOnServer(drag);
    }
  }
};

let collectForDrag = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

let collectForDrop = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget()
  };
};

let Task = React.createClass({

  render() {
    const {connectDragSource, isDragging, connectDropTarget} = this.props;

    const taskStyle = {
      opacity: isDragging ? 0.5 : 1,
      cursor: 'move'
    };

    let user = () => {
      if (this.props.user) {
        const taskPictureStyle = {
          backgroundImage: 'url(' + this.props.user.picture + ')'
        };
        return [
          <span className='task-username'>{this.props.user.username}</span>,
          <span className='task-picture' style={taskPictureStyle}></span>
        ];
      }
    };

    return connectDragSource(connectDropTarget(
      <div className='task' style={taskStyle}>
        <span className='task-name'>{this.props.name}</span>
        <span className='task-description'>{this.props.description}</span>
        <span className='task-score'>{this.props.score}</span>
        {user()}
      </div>
    ));
  }

});

Task.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

export default DropTarget('task', taskTarget, collectForDrop)(DragSource('task', taskSource, collectForDrag)(Task));
