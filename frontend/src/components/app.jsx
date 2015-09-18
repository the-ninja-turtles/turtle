import React from 'react';
import Reflux from 'reflux';
import Router from 'react-router';
import {Navbar, Nav, NavItem, CollapsibleNav} from 'react-bootstrap';
import auth from '../auth/auth.js';
import AppStore from '../stores/appStore.js';
import Notifications from './notifications/notifications.jsx';
import {ProjectActions, TaskFormActions} from '../actions/actions.js';
let RouteHandler = Router.RouteHandler;

let App = React.createClass({

  mixins: [Reflux.ListenerMixin, Router.State, Router.Navigation],

  getInitialState() {
    return {
      isLoggedIn: auth().isLoggedin(),
      hasCurrentSprint: false
    };
  },

  componentDidMount() {
    this.listenTo(AppStore, this.onStoreUpdate);
  },

  onStoreUpdate(data) {
    this.setState(data);
  },

  goToDashboard() {
    this.transitionTo('dashboard');
  },

  goToProject() {
    this.transitionTo('project', {id: this.getParams().id});
  },

  goToSprintboard() {
    this.transitionTo('sprint', {id: this.getParams().id});
  },

  startSprint() {
    ProjectActions.startSprint(() => {
      this.transitionTo('sprint', {id: this.getParams().id});
    });
  },

  endSprint() {
    ProjectActions.endSprint();
  },

  render() {
    let btn = (jsx) => {
      return (
        <li>
          <div className='nav-button'>
            {jsx}
          </div>
        </li>
      );
    };

    let project = () => {
      if (this.isActive('sprint')) {
        return (<NavItem onClick={this.goToProject}>Project</NavItem>);
      }
    };

    let createTask = () => {
      if (this.isActive('sprint')) {
        return btn(<button className='btn primary' onClick={TaskFormActions.createTask}>+ New Task</button>);
      }
    };

    let startEndSprint = () => {
      if (this.isActive('project')) {
        if (!this.state.hasCurrentSprint) {
          return btn(<button className='btn primary' onClick={this.startSprint}>Start Sprint</button>);
        } else {
          return btn(<button className='btn danger' onClick={this.endSprint}>End Sprint</button>);
        }
      }
    };

    let gotoSprintboard = () => {
      if (this.isActive('project') && this.state.hasCurrentSprint) {
        return btn(<button className='btn primary' onClick={this.goToSprintboard}>Open Sprintboard</button>);
      }
    };

    let authNav = () => {
      if (this.state.isLoggedIn) {
        return (<NavItem onClick={auth().logout}>Sign out</NavItem>);
      }
      return (<NavItem onClick={auth().login.bind(auth())}>Sign in</NavItem>);
    };

    return (
      <div className='app'>
        <Navbar brand='Turtle' fixedTop inverse toggleNavKey={0}>
          <CollapsibleNav eventKey={0}>
            <Nav navbar>
              <NavItem onClick={this.goToDashboard}>Dashboard</NavItem>
              {project()}
              {createTask()}
              {startEndSprint()}
              {gotoSprintboard()}
            </Nav>
            <Nav navbar right>{authNav()}</Nav>
          </CollapsibleNav>
        </Navbar>
        <Notifications />
        <RouteHandler/>
      </div>
    );
  }
});

export default App;
