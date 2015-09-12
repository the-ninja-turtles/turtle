import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';
import {Modal, Input} from 'react-bootstrap';
import {CreateTaskActions} from '../../actions/actions';
import CreateTaskStore from '../../stores/createTaskStore';

let CreateTask = React.createClass({
  mixins: [Reflux.ListenerMixin],

  propTypes: {
    showModal: React.PropTypes.bool.isRequired,
    close: React.PropTypes.func.isRequired,
    projectId: React.PropTypes.number.isRequired,
    users: React.PropTypes.array.isRequired,
    status: React.PropTypes.string.isRequired,
    rank: React.PropTypes.number.isRequired,
    sprintId: React.PropTypes.number // defaults to null
  },

  getInitialState() {
    return {
      disableCreate: true,
      taskProperties: {
        name: '',
        description: '',
        status: this.props.status,
        score: 1,
        rank: this.props.rank,
        userId: null,
        sprintId: this.props.sprintId || null
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
    CreateTaskActions.createTask(this.props.projectId, this.state.taskProperties);
  },

  handleChanges(e) {
    let newProperties = _.extend({}, this.state.taskProperties);
    newProperties.name = React.findDOMNode(this.refs.taskName).value;
    newProperties.description = React.findDOMNode(this.refs.taskDescription).value;
    // uncomment when ready, or else task will not be accepted by project svc
    // newProperties.userId = parseInt(this.refs.taskAssignment.getValue()) || null;
    newProperties.score = Math.max(1, React.findDOMNode(this.refs.taskScore).value);

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
            className='btn primary'
            disabled={this.state.disableCreate}
            onClick={this.createTask}
          >
            Create
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
});

export default CreateTask;
