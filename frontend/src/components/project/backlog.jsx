import React from 'react/addons';
import Task from './task.jsx';

let Backlog = React.createClass({

  render() {
    let tasks = this.props.tasks.map((task) => {
      return (<Task key={task.id} id={task.id} name={task.name} description={task.description} score={task.score} />);
    });

    return (
      <div className='backlog'>
        <h1>Backlog</h1>
        <button className='btn'>+ New Task</button>
        <div className='clearfix'></div>
        <div className='tasks'>{tasks}</div>
      </div>
    );
  }

});

export default Backlog;
