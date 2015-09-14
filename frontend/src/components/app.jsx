import React from 'react';
import Reflux from 'reflux';
import Router from 'react-router';
import {Navbar, Nav, NavItem, CollapsibleNav} from 'react-bootstrap';
import auth from '../auth/auth.js';
import AppStore from '../stores/appStore.js';
import Notifications from './notifications/notifications.jsx';
import {SprintActions} from '../actions/actions.js';

let RouteHandler = Router.RouteHandler;

let App = React.createClass({

  mixins: [Reflux.ListenerMixin, Router.State, Router.Navigation],

  getInitialState() {
    return {
      isLoggedIn: auth().isLoggedin(),
      currentProject: null,
      currentSprint: null
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

  render() {
    let project = () => {
      if (this.isActive('sprint')) {
        return (<NavItem onClick={this.goToProject}>Project</NavItem>);
      }
    };

    let createTask = () => {
      if (this.isActive('sprint')) {
        return (
          <li>
            <div className='btn-container nav-button'>
              <button className='btn primary' onClick={SprintActions.openCreateTask}>+ New Task</button>
            </div>
          </li>
        );
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
        <Navbar brand='Turtle' inverse toggleNavKey={0}>
          <CollapsibleNav eventKey={0}>
            <Nav navbar>
              <NavItem onClick={this.goToDashboard}>Dashboard</NavItem>
              {project()}
              {createTask()}
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
