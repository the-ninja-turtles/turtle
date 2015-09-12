import Reflux from 'reflux';
import {EventActions as Actions} from '../actions/actions';

let NotificationStore = Reflux.createStore({
  listenables: Actions,

  onNotify(event) {
    this.trigger(event);
  }
});

export default NotificationStore;
