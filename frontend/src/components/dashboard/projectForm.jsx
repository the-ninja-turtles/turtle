import _ from 'lodash';
import React from 'react';
import {Modal, Input, OverlayTrigger, Tooltip} from 'react-bootstrap';
import Member from './member.jsx';
import {DashboardActions} from '../../actions/actions.js';

let ProjectForm = React.createClass({

  getInitialState() {
    return {
      projectName: '',
      invitees: [],
      inviteeEmail: '',
      disableInvite: true,
      disableSubmit: true
    };
  },

  componentWillReceiveProps(nextProps) {
    let project = nextProps.project;
    if (project) {
      this.setState({
        projectName: project.name,
        invitees: _.pluck(project.users, 'email')
      });
    } else {
      this.setState(this.getInitialState());
    }
  },

  checkEmail(e) {
    // consider replacing this with proper email validation
    this.setState({
      disableInvite: !e.target.value,
      inviteeEmail: e.target.value
    });
  },

  invite() {
    let email = this.refs.inviteeEmail.getValue();
    if (email) {
      let invitees = this.state.invitees.slice();
      invitees.push(email);
      let data = {
        invitees,
        inviteeEmail: '',
        disableInvite: true
      };
      if (this.props.project) {
        data.disableSubmit = false;
      }

      this.setState(data);
    }
  },

  removeInvite(index) {
    let invitees = this.state.invitees.slice();
    invitees.splice(index, 1);

    let data = {invitees: invitees};
    if (this.props.project) {
      data.disableSubmit = false;
    }

    this.setState(data);
  },

  checkName(e) {
    this.setState({
      disableSubmit: !e.target.value,
      projectName: e.target.value.substr(0, 40)
    });
  },

  createProject() {
    if (this.state.projectName) {
      DashboardActions.createProject(this.state.projectName, this.state.invitees, (response) => { // check `response.error` for error
        this.close();
      });
    }
  },

  saveProject() {
    if (this.state.projectName) {
      let team = {
        add: _.without.apply(null, [this.state.invitees].concat(_.pluck(this.props.project.users, 'email'))),
        remove: _.without.apply(null, [_.pluck(this.props.project.users, 'email')].concat(this.state.invitees))
      };
      DashboardActions.saveProject(this.props.project.id, this.state.projectName, team, (response) => {
        this.close();
      });
    }
  },

  close() {
    this.props.close();
    this.setState(this.getInitialState());
  },

  render() {
    let inviteeList = (
      <div className='members'>
        <ul>
          {
            this.state.invitees.map((invitee, idx) => {
              return (
                <Member
                  key={idx}
                  idx={idx}
                  email={invitee}
                  remove={this.removeInvite}
                />
              );
            })
          }
        </ul>
      </div>
    );

    const inviteButton = (
      <button
        className='btn primary'
        onClick={this.invite}
        disabled={this.state.disableInvite}
      >
        Invite
      </button>
    );

    let letterCount = (
      <Tooltip id='project-letter-count'>{40 - this.state.projectName.length}</Tooltip>
    );

    let title = () => {
      return this.props.project ? 'Edit Project' : 'Create a New Project';
    };

    let createButton = () => {
      return this.props.project ? null : (
        <button
          className='btn block primary'
          onClick={this.createProject}
          disabled={this.state.disableSubmit}
        >
          Create project
        </button>
      );
    };

    let saveAndCancelButton = () => {
      return this.props.project ? (
        <div>
          <button
            className='btn primary'
            style={{display: 'inline-block'}}
            onClick={this.close}
          >
            Cancel
          </button>
          <button
            className='btn primary'
            style={{display: 'inline-block'}}
            onClick={this.saveProject}
            disabled={this.state.disableSubmit}
          >
            Save
          </button>
        </div>
      ) : null;
    };

    return (
      <Modal show={this.props.showModal} onHide={this.close} dialogClassName='modal-create-project'>
        <Modal.Header closeButton>
          <Modal.Title>{title()}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className='create-project'>
            <OverlayTrigger trigger='focus' placement='right' overlay={letterCount}>
              <input
                type='text'
                className='name'
                ref='projectName'
                placeholder='Title'
                onChange={this.checkName}
                value={this.state.projectName}
              />
            </OverlayTrigger>

            <label className='team'>Team Members</label>
            <form>
              <Input
                type='email'
                className='invitee'
                ref='inviteeEmail'
                placeholder='Email address'
                onChange={this.checkEmail}
                value={this.state.inviteeEmail}
                buttonAfter={inviteButton}
              />
            </form>

            {(() => {
              return this.state.invitees.length ? inviteeList : undefined;
            })()}
          </div>
        </Modal.Body>

        <Modal.Footer>
          {createButton()}
          {saveAndCancelButton()}
        </Modal.Footer>
      </Modal>
    );
  }
});

export default ProjectForm;
