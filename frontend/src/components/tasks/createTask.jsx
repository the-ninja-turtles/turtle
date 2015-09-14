import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';
import {Modal, Input} from 'react-bootstrap';
import {ProjectActions} from '../../actions/actions';
import CreateTaskStore from '../../stores/createTaskStore';

let CreateTask = React.createClass({
  mixins: [Reflux.ListenerMixin],

  propTypes: {
    project: React.PropTypes.number.isRequired,
    showModal: React.PropTypes.bool.isRequired,
    close: React.PropTypes.func.isRequired,
    users: React.PropTypes.array.isRequired,
    sprint: React.PropTypes.number // defaults to null
  },

  getInitialState() {
    return {
      disableCreate: true,
      taskProperties: {
        name: '',
        description: '',
        score: 1,
        userId: null
      }
    };
  },

  componentDidMount() {
    this.listenTo(CreateTaskStore, this.onStoreUpdate);
  },

  onStoreUpdate(response) {
    if (!response.error) {
      this.close();
    }
  },

  createTask() {
    let taskProperties = _.extend({sprintId: this.props.sprint}, this.state.taskProperties);
    ProjectActions.createTask(this.props.project, taskProperties);
  },

  handleChanges(e) {
    let newProperties = _.extend({}, this.state.taskProperties);
    newProperties.name = React.findDOMNode(this.refs.taskName).value;
    newProperties.description = React.findDOMNode(this.refs.taskDescription).value;
    newProperties.userId = parseInt(this.refs.taskAssignment.getValue()) || null;
    newProperties.score = Math.min(999, Math.max(1, React.findDOMNode(this.refs.taskScore).value));

    this.setState({
      taskProperties: newProperties,
      disableCreate: !(newProperties.name && newProperties.score)
    });
  },

  close() {
    this.props.close();
    this.setState(this.getInitialState());
  },

  render() {

    return (
      <Modal show={this.props.showModal} onHide={this.close} bsSize='sm'>
        <Modal.Header closeButton>
          <Modal.Title>Create a New Task</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form className='create-task'>
            <input
              type='text'
              className='name'
              ref='taskName'
              placeholder='Title'
              onChange={this.handleChanges}
              value={this.state.taskProperties.name}
            />

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
              <input
                type='number'
                className='score'
                ref='taskScore'
                min='1'
                onChange={this.handleChanges}
                value={this.state.taskProperties.score}
              />
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <button
            className='btn block primary'
            disabled={this.state.disableCreate}
            onClick={this.createTask}
          >
            Create task
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
});

export default CreateTask;
