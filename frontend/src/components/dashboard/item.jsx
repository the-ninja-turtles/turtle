import React from 'react';
import classNames from 'classnames';
import {OverlayTrigger, Tooltip, Glyphicon} from 'react-bootstrap';
import {DashboardActions} from '../../actions/actions';

let Item = React.createClass({

  handleClick() {
    // this.props.key is not accessible, this is the recommended approach
    // pass in id as another property
    this.props.click(this.props.id);
  },

  editProject(e) {
    e.stopPropagation();
    DashboardActions.editProject(this.props.id);
  },

  deleteProject(e) {
    e.stopPropagation();
    this.props.delete(this.props.id);
  },

  render() {
    let editTooltip = (
      <Tooltip id='tip-edit'>Edit Project</Tooltip>
    );

    let deleteTooltip = (
      <Tooltip id='tip-delete'><strong>Permanently</strong> Delete Project</Tooltip>
    );

    let classes = classNames({
      'item': true,
      'new-project': this.props.isCreateProject
    });
    return (
      <li className={classes} onClick={this.handleClick}>
        <OverlayTrigger rootClose placement='top' overlay={editTooltip}>
          <button className='close edit' onClick={this.editProject}><Glyphicon glyph='pencil' /></button>
        </OverlayTrigger>
        <OverlayTrigger rootClose placement='top' overlay={deleteTooltip}>
          <button className='close' onClick={this.deleteProject}><Glyphicon glyph='remove' /></button>
        </OverlayTrigger>
        <p className='name'>{this.props.name}</p>
      </li>
    );
  }
});

export default Item;
