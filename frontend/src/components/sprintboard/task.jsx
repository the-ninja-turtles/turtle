import React, {PropTypes} from 'react/addons';
import {SprintActions} from '../../actions/actions';
import {ItemTypes} from '../../constants/dragAndDropConstants';
import {DragSource, DropTarget} from 'react-dnd';

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
  // on hovering a dragged task over another task
  // fire an action that will change their positions in the column array
  hover(props, monitor) {
    const draggedId = monitor.getItem().id;
    if (draggedId !== props.id) {
      SprintActions.reorderTasksLocally({
        draggedTaskId: draggedId,
        targetTaskId: props.id
      });
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
    return connectDragSource(connectDropTarget(
      <div className='sprint-task' style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move'
      }}>
        <span className='task-name'>{this.props.name}</span>
        <span className='task-description'>{this.props.description}</span>
        <span>{this.props.user.name}</span>
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
