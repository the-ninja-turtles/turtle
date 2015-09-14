import Reflux from 'reflux';
import {UserActions, NavbarActions} from '../actions/actions';

let AppStore = Reflux.createStore({
  listenables: [UserActions, NavbarActions],

  onLoggedIn(token) {
    this.trigger({isLoggedIn: true});
  },

  onLoggedOut() {
    this.trigger({isLoggedIn: false});
  },

  onShowStartSprintBtn() {
    this.trigger({showStartSprint: true});
  },

  onShowEndSprintBtn() {
    this.trigger({showStartSprint: false});
  }
});

export default AppStore;
