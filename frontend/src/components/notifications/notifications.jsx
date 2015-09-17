import _ from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import Notification from 'react-notification';
import NotificationStore from '../../stores/notificationStore.js';

let Notifications = React.createClass({

  mixins: [Reflux.ListenerMixin],

  componentDidMount() {
    this.listenTo(NotificationStore, this.onStoreUpdate);
  },

  onStoreUpdate(event) {
    this.setState({isActive: true, message: event.message});
  },

  getInitialState: function () {
    return {
      isActive: false,
      message: ''
    };
  },

  onDismiss(index) {
    this.setState({isActive: false});
  },

  render() {
    if (this.state.isActive) {
      _.delay(this.onDismiss, 2000);
    }
    return (
      <div className='notifications'>
        <Notification message={this.state.message} isActive={this.state.isActive} action='' />
      </div>
    );
  }

});

export default Notifications;
