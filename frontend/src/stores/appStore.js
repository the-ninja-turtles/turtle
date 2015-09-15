import Reflux from 'reflux';
import {UserActions, NavbarActions} from '../actions/actions';

let AppStore = Reflux.createStore({
  listenables: [UserActions, NavbarActions],

  initialize() {
    this.hasCurrentSprint = false;
  },

  onLoggedIn(token) {
    this.trigger({isLoggedIn: true});
  },

  onLoggedOut() {
    this.trigger({isLoggedIn: false});
  },

  onSetHasCurrentSprint(val) {
    if (this.hasCurrentSprint !== val) {
      this.hasCurrentSprint = val;
      this.trigger({hasCurrentSprint: val});
    }
  }
});

export default AppStore;
