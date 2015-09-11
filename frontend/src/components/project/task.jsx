import React, {PropTypes} from 'react';
import {ProjectActions} from '../../actions/actions';
import {ItemTypes} from '../../constants/dragAndDropConstants';
import {DragSource, DropTarget} from 'react-dnd';

const taskSource = {
  beginDrag(props) {
    return {id: props.id};
  }
};

const taskTarget = {
  // this event will happen frequently, on any movement while hovering
  // over another task
  hover(props, monitor) {
    const draggedId = monitor.getItem().id;
    if (draggedId !== props.id) {
      ProjectActions.moveTask({
        draggedTaskId: draggedId,
        targetTaskId: props.id
      });
    }
  },

  // on dropping a task card on another task card, a message should be sent to the server
  drop(props, monitor) {
    const draggedId = monitor.getItem().id;
    ProjectActions.updateTaskPositionOnServer({
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
    return connectDragSource(connectDropTarget(
      <div className='backlog-task' style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move'
      }}>
        <span className='title'>{this.props.name}</span>
        <span className='text'>{this.props.description}</span>
        <span className='circle'>{this.props.score}</span>
        <img className='circle' src='https://secure.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png' />
        <div className='clearfix'></div>
      </div>
    ));
  }

});

Task.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

export default DropTarget(ItemTypes.PROJECTTASK, taskTarget, collectForDrop)(DragSource(ItemTypes.PROJECTTASK, taskSource, collectForDrag)(Task));
