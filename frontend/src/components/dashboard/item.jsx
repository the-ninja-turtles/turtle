import React from 'react';
import classNames from 'classnames';

let Item = React.createClass({

  handleClick() {
    // this.props.key is not accessible, this is the recommended approach
    // pass in id as another property
    this.props.click(this.props.id);
  },

  deleteProject(e) {
    e.stopPropagation();
    this.props.delete(this.props.id);
  },

  render() {
    let classes = classNames({
      'item': true,
      'new-project': this.props.isCreateProject
    });
    return (
      <li className={classes} onClick={this.handleClick}>
        <button className='close' onClick={this.deleteProject}><span>x</span></button>
        <p className='name'>{this.props.name}</p>
      </li>
    );
  }
});

export default Item;
