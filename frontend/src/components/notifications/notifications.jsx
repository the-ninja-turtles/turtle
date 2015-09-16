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
    this.state.notifications.push({isActive: true, message: event.message});
    this.setState({notifications: this.state.notifications});
  },

  getInitialState: function () {
    return {
      notifications: []
    };
  },

  onDismiss(index) {
    this.state.notifications[index].isActive = false;
    this.setState({notifications: this.state.notifications});
  },

  render() {
    let notifications = _.map(this.state.notifications, (notification, index) => {
      if (notification.isActive) {
        _.delay(this.onDismiss, 2000, index);
      }
      return (<Notification key={index} message={notification.message} isActive={notification.isActive} action='' />);
    });
    return (<div className='notifications'>{notifications}</div>);
  }

});

export default Notifications;
