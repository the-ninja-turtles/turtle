import React, {PropTypes} from 'react/addons';
import {SprintActions} from '../../actions/actions';
import {ItemTypes} from '../../constants/dragAndDropConstants';
import {DragSource, DropTarget} from 'react-dnd';

const taskSource = {
  beginDrag(props) {
    // when drag starts, this object will be returned
    // (it contains the task id, so that the dragged task can be identified and updated)
    return {id: props.id};
  }
};

// for dropping task on a task (sorting within columns)
const taskTarget = {
  // on hovering a dragged task card over another task card, they should adjust their
  // positions, but not send a message to the server (because hover is triggering events
  // very frequently)
  hover(props, monitor) {
    const draggedId = monitor.getItem().id;
    if (draggedId !== props.id) {
      SprintActions.updateTaskRankLocally({
        draggedTaskId: draggedId,
        targetTaskId: props.id
      });
    }
  },

  // on dropping a task card on another task card, a message should be sent to the server
  drop(props, monitor) {
    const draggedId = monitor.getItem().id;
    SprintActions.updateTaskRankOnServer({
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
      <div className='sprint-task' style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move'
      }}>
        <p>{this.props.name}</p>
        <p>Description: {this.props.description}</p>
        <p>Assigned to: {this.props.assignedUser}</p>
      </div>
    ));
  }

});

Task.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

export default DropTarget(ItemTypes.SPRINTTASK, taskTarget, collectForDrop)(DragSource(ItemTypes.SPRINTTASK, taskSource, collectForDrag)(Task));
