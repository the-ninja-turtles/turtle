import React from 'react/addons';
import Task from './task.jsx';

let SprintColumn = React.createClass({

  render() {
    let tasks = this.props.tasks.map((task) => {
      if (task.status === this.props.columnName) {
        return (
          <Task
            name={task.name}
            description={task.description}
            assignedUser={task.user}
          />
        );
      }
    });
    console.log('column properties', this.props);
    return (
      <div className="sprintColumn">
        <p className="columnName">{this.props.columnName}</p>
        {tasks}
      </div>
    );
  }

});

export default SprintColumn;
