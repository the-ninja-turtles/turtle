import React, {PropTypes} from 'react/addons';
import {DragSource, DropTarget} from 'react-dnd';
import {TaskActions} from '../../actions/actions.js';

const taskSource = {
  beginDrag(props) {
    return {id: props.id};
  }
};

const taskTarget = {
  hover(props, monitor) {
    const draggedId = monitor.getItem().id;
    if (draggedId !== props.id) {
      TaskActions.updateTaskPosLocally({
        draggedTaskId: draggedId,
        targetTaskId: props.id
      });
    }
  },

  drop(props, monitor) {
    const draggedId = monitor.getItem().id;
    TaskActions.updateTaskPosOnServer({
      draggedTaskId: draggedId,
      targetTaskId: props.id
    });
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
      <div className='sprint-task' style={taskStyle}>
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
