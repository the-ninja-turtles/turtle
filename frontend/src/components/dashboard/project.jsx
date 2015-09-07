import React from 'react/addons';

let Project = React.createClass({
  handleClick() {
    // this.props.key is not accessible, this is the recommended approach
    // pass in id as another property
    this.props.click(this.props.id);
  },
  render() {
    return (
      <li className='project' onClick={this.handleClick}>
        <p className='project-name'>{this.props.name}</p>
      </li>
    );
  }
});

export default Project;
