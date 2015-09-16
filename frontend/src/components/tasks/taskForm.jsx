import React from 'react';
import Reflux from 'reflux';
import Router from 'react-router';
import _ from 'lodash';
import {Modal, Input, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {ProjectActions, TaskFormActions} from '../../actions/actions';
import TaskFormStore from '../../stores/taskFormStore';

let TaskForm = React.createClass({
  mixins: [Reflux.ListenerMixin, Router.State],

  propTypes: {
    project: React.PropTypes.number.isRequired,
    users: React.PropTypes.array.isRequired,
    sprint: React.PropTypes.number // defaults to null
  },

  getInitialState() {
    return this.newTaskFormState;
  },

  componentDidMount() {
    this.listenTo(TaskFormStore, this.onStoreUpdate);
  },

  onStoreUpdate(params) {
    this.setState(this.newTaskFormState);
    if (params.success) {
      this.closeAndUpdate();
    }
    if (params.action === 'create') {
      let newState = Object.create(this.newTaskFormState);
      newState.show = true;
      this.setState(newState);
    }
    if (params.action === 'edit') {
      let taskProperties = {
        id: params.id,
        name: params.name,
        description: params.description || '',
        score: params.score || 1,
        sprintId: params.sprintId,
        userId: params.userId
      };
      this.setState({show: true, isNewTask: false, taskProperties: taskProperties});
    }
  },

  newTaskFormState: {
    disableCreate: true,
    show: false,
    isNewTask: true,
    taskProperties: {
      name: '',
      description: '',
      score: 1,
      userId: null
    }
  },

  createTask() {
    let taskProperties = _.extend({sprintId: this.props.sprint}, this.state.taskProperties);
    TaskFormActions.saveTask(this.props.project, taskProperties);
  },

  updateTask() {
    let projectId = this.props.project;
    let taskId = this.state.taskProperties.id;
    let taskProperties = _.chain(this.state.taskProperties)
      .extend({sprintId: this.props.sprint})
      .pick('name', 'score', 'description', 'userId', 'sprintId')
      .value();
    TaskFormActions.updateTask({
      projectId: projectId,
      taskId: taskId,
      taskProperties: taskProperties
    });
  },

  handleChanges(e) {
    let newProperties = _.extend({}, this.state.taskProperties);
    newProperties.name = React.findDOMNode(this.refs.taskName).value.substr(0, 255);
    newProperties.description = React.findDOMNode(this.refs.taskDescription).value;
    newProperties.userId = parseInt(this.refs.taskAssignment.getValue()) || null;
    newProperties.score = Math.min(999, Math.max(1, React.findDOMNode(this.refs.taskScore).value));

    this.setState({
      taskProperties: newProperties,
      disableCreate: !(newProperties.name && newProperties.score)
    });
  },

  close() {
    this.setState({show: false});
    // this.setState(this.newTaskFormState);
  },

  closeAndUpdate() {
    this.setState({show: false});
    // this.setState(this.newTaskFormState);
    // if this task form was opened in the project view, refresh the project view
    // if this task form was opened in the sprintboard view, refresh the sprint view
    ProjectActions.fetchProject(this.props.project);
  },

  deleteTask() {
    let params = {
      projectId: this.props.project,
      taskId: this.state.taskProperties.id
    };
    TaskFormActions.deleteTask(params);
  },

  render() {
    let heading = () => {
      if (this.state.isNewTask) {
        return 'Create a New Task';
      } else {
        return 'Edit Task';
      }
    };

    let deleteButton = () => {
      if (!this.state.isNewTask) {
        return (
          <button
            className='btn danger'
            style={{display: 'inline-block'}}
            onClick={this.deleteTask}
          >
            Delete task
          </button>
        );
      }
    };

    let createOrUpdateButton = () => {
      let classes, text, onclick;
      if (this.state.isNewTask) {
        classes = 'btn block primary';
        text = 'Create task';
        onclick = this.createTask;
      } else {
        classes = 'btn primary';
        text = 'Update task';
        onclick = this.updateTask;
      }
      return (
        <button
          className={classes}
          style={{display: 'inline-block'}}
          disabled={this.state.disableCreate}
          onClick={onclick}
        >
          {text}
        </button>
      );
    };

    let letterCount = (
      <Tooltip id='task-letter-count'>{255 - this.state.taskProperties.name.length}</Tooltip>
    );

    let scoreTooltip = (
      <Tooltip id='tip-score'>Number between 1 - 999</Tooltip>
    );

    return (
      <Modal show={this.state.show} onHide={this.close} dialogClassName='modal-create-task'>
        <Modal.Header closeButton>
          <Modal.Title>{heading()}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form className='create-task'>
            <OverlayTrigger trigger='focus' placement='right' overlay={letterCount}>
            <input
              type='text'
              className='name'
              ref='taskName'
              placeholder='Title'
              onChange={this.handleChanges}
              value={this.state.taskProperties.name}
            />
            </OverlayTrigger>

            <textarea
              className='description'
              ref='taskDescription'
              placeholder='Enter task description'
              onChange={this.handleChanges}
              value={this.state.taskProperties.description}
            >
            </textarea>

            <div className='assignment'>
              <Input
                type='select'
                ref='taskAssignment'
                onChange={this.handleChanges}
                value={this.state.taskProperties.userId}
                label='Assign to:'
              >
                <option value=''>None</option>
                {
                  this.props.users.map((user) => {
                    return <option key={user.id} value={user.id}>{user.username}</option>;
                  })
                }
              </Input>
            </div>

            <div className='score'>
              <label>Score:</label>
              <OverlayTrigger placement='right' overlay={scoreTooltip}>
                <input
                  type='number'
                  className='score'
                  ref='taskScore'
                  min='1'
                  onChange={this.handleChanges}
                  value={this.state.taskProperties.score}
                />
              </OverlayTrigger>
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          {deleteButton()}
          {createOrUpdateButton()}
        </Modal.Footer>
      </Modal>
    );
  }
});

export default TaskForm;
