import React from 'react';

let Member = React.createClass({
  handleClick() {
    // this.props.key is not accessible, this is the recommended approach
    // pass in id as another property
    this.props.remove(this.props.idx);
  },
  render() {
    return (
      <li className='member'>
        <span className='email'>{this.props.email}</span>
        <button className='btn' onClick={this.handleClick}>Remove</button>
      </li>
    );
  }
});

export default Member;
