import React from 'react/addons';

let Task = React.createClass({

  render() {
    return (
      <div className='backlog-task'>
        <span className='title'>{this.props.name}</span>
        <span className='text'>{this.props.description}</span>
        <span className='circle'>{this.props.score}</span>
        <img className='circle' src='https://secure.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png' />
        <div className='clearfix'></div>
      </div>
    );
  }

});

export default Task;
