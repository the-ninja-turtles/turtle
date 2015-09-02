import React from 'react/addons';

let Task = React.createClass({

  render() {

    return (
      <div className='sprintTask'>
        <p>{this.props.name}</p>
        <p>Description: {this.props.description}</p>
        <p>Assigned to: {this.props.assignedUser}</p>
      </div>
    );
  }

});

export default Task;
