import Reflux from 'reflux';
import Actions from '../actions/actions';

const HelloStore = Reflux.createStore({
  listenables: Actions,

  onAddresseeUpdate() {
    console.log('heard you!');
    let addressee = 'dudes';
    this.trigger(addressee);
  }

});

export default HelloStore;
