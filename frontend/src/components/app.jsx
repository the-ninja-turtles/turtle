import React from 'react';
import Reflux from 'reflux';
import Router from 'react-router';
import {Navbar, Nav, NavItem, CollapsibleNav} from 'react-bootstrap';
import auth from '../auth/auth.js';
import AppStore from '../stores/appStore.js';

let RouteHandler = Router.RouteHandler;

let App = React.createClass({

  mixins: [Reflux.ListenerMixin],

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

  render() {
    let authNav = () => {
      if (this.state.isLoggedIn) {
        return (<NavItem onClick={auth().logout}>Sign out</NavItem>);
      }
      return (<NavItem onClick={auth().login.bind(auth())}>Sign in</NavItem>);
    };

    return (
      <div>
        <Navbar brand='Turtle' toggleNavKey={0}>
          <CollapsibleNav eventKey={0}>
            <Nav navbar>
              <NavItem href='/'>Dashboard</NavItem>
            </Nav>
            <Nav navbar right>{authNav()}</Nav>
          </CollapsibleNav>
        </Navbar>
        <RouteHandler/>
      </div>
    );
  }
});

export default App;
