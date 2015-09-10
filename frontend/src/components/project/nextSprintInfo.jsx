import React from 'react';

let NextSprintInfo = React.createClass({

  render() {
    return (
      <div className='next-sprint-info'>
        <h1>Create a new sprint</h1>
        <label className='points'>Points <span className='points-count'>70</span></label>
        <div className='clearfix'></div>
        <label>Name
          <input type='text' />
        </label>
        <label>Start
          <input type='text' />
        </label>
        <label>End
          <input type='text' />
        </label>
        <button className='btn'>Start sprint</button>
        <div className='clearfix'></div>
      </div>
    );
  }

});

export default NextSprintInfo;
