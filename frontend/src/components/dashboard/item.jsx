import React from 'react/addons';
import classNames from 'classnames';

let Item = React.createClass({
  handleClick() {
    // this.props.key is not accessible, this is the recommended approach
    // pass in id as another property
    this.props.click(this.props.id);
  },
  render() {
    let classes = classNames({
      'item': true,
      'project-create': this.props.isCreateProject
    });
    return (
      <li className={classes} onClick={this.handleClick}>
        <p className='name'>{this.props.name}</p>
      </li>
    );
  }
});

export default Item;
