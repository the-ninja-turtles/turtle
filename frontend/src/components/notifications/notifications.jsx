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
    let e = this.state[event];
    e.isActive = true;
    this.setState(e);
  },

  getInitialState: function () {
    return {
      'project:add': {
        message: 'project:add',
        isActive: false
      },
      'project:change': {
        message: 'project:change',
        isActive: false
      },
      'task:add': {
        message: 'task:add',
        isActive: false
      },
      'task:change': {
        message: 'task:change',
        isActive: false
      }
    };
  },

  onDismiss(event) {
    let e = this.state[event];
    e.isActive = false;
    this.setState(e);
  },

  render() {
    let notifications = _.mapValues(this.state, (notification, key) => {
      return (<Notification message={notification.message} isActive={notification.isActive} onDismiss={this.onDismiss.bind(this, key)} />);
    });
    return (<div className='notifications'>{notifications}</div>);
  }

});

export default Notifications;
