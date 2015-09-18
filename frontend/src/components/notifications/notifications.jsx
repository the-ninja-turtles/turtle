// import _ from 'lodash';
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

  getNotificationStyles() {
    let bar = {
      backgroundColor: '#61ACEA',
      zIndex: '999999',
      fontSize: '16px !important'
    };

    return {bar};
  },

  onDismiss() {
    this.setState({isActive: false});
  },

  render() {
    return (
      <div>
        <Notification
          isActive={this.state.isActive}
          message={this.state.message}
          action=''
          style={this.getNotificationStyles()}
          dismissAfter={2000}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
});

export default Notifications;
