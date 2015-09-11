import Reflux from 'reflux';
import {UserActions as Actions} from '../actions/actions';

let AppStore = Reflux.createStore({
  listenables: Actions,

  onLoggedIn(token) {
    this.trigger({isLoggedIn: true});
  },

  onLoggedOut() {
    this.trigger({isLoggedIn: false});
  }
});

export default AppStore;
