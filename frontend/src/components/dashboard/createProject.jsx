import React from 'react';
import {Modal} from 'react-bootstrap';
import Member from './member.jsx';
import {DashboardActions as Actions} from '../../actions/actions.js';

let CreateProject = React.createClass({
  getInitialState() {
    return {
      invitees: [],
      inviteeEmail: '',
      disableInvite: true,
      disableCreate: true
    };
  },

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.showModal && this.props.showModal) {
      React.findDOMNode(this.refs.projectName).focus();
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
    let email = React.findDOMNode(this.refs.inviteeEmail).value;
    if (email) {
      let invitees = this.state.invitees.slice();
      invitees.push({email: email});
      this.setState({
        invitees: invitees,
        inviteeEmail: '',
        disableInvite: true
      });
    }
  },

  removeInvite(index) {
    let invitees = this.state.invitees.slice();
    invitees.splice(index, 1);
    this.setState({invitees: invitees});
  },

  checkName(e) {
    this.setState({disableCreate: !e.target.value});
  },

  createProject() {
    let name = React.findDOMNode(this.refs.projectName).value;
    if (name) {
      Actions.createProject(name);
      this.props.close();
    }
  },

  render() {
    let nameSection = (
      <section className='create-name'>
        <h3>Project Name</h3>
        <input type='text' ref='projectName' placeholder='Ex. Turtle' onChange={this.checkName} />
      </section>
    );

    let inviteSection = (
      <section className='create-invite'>
        <h3>Team Members</h3>
        <form>
          <input type='email' ref='inviteeEmail' placeholder='somebody@turtle.com' onChange={this.checkEmail} value={this.state.inviteeEmail} />
          <button className='btn' onClick={this.invite} disabled={this.state.disableInvite}>Invite</button>
        </form>
      </section>
    );

    let inviteeList = (
      <section className='create-invitees'>
        <ul>
          {
            this.state.invitees.map((invitee, idx) => {
              return <Member key={idx} idx={idx} email={invitee.email} remove={this.removeInvite} />;
            })
          }
        </ul>
      </section>
    );

    return (
      <Modal show={this.props.showModal} onHide={this.props.close}>
        <Modal.Header closeButton>
          <Modal.Title>Create a New Project</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {nameSection}
          {inviteSection}
          {(() => {
            return this.state.invitees.length ? inviteeList : undefined;
          })()}
        </Modal.Body>

        <Modal.Footer>
          <button className='btn' onClick={this.createProject} disabled={this.state.disableCreate}>Create</button>
        </Modal.Footer>
      </Modal>
    );
  }
});

export default CreateProject;
