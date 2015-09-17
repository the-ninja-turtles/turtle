import _ from 'lodash';
import {origin} from './ajax.js';
import auth from '../auth/auth.js';

export default class Subscription {

  constructor(namespace) {
    this._eventListeners = [];
    this._sub = auth().token().then((token) => {
      let url = origin('events', 4000) + '/subscribe/' + namespace + '/' + token;
      return new EventSource(url);
    });
  }

  on(resource, event, callback, filter) {
    filter = filter || _.identity;
    if (this._sub) {
      this._sub.then((es) => {
        let channel = resource + ':' + event;
        let fn = (e) => {
          let data = JSON.parse(e.data);
          data.event = channel;
          filter(data) && callback(data);
        };
        this._eventListeners.push({channel, fn});
        es.addEventListener(channel, fn, false);
      });
    }
  }

  off() {
    return this._sub.then((es) => {
      _.each(this._eventListeners, (listener) => {
        es.removeEventListener(listener.channel, listener.fn);
      });
      this._eventListeners = [];
    });
  }

  close() {
    if (this._sub) {
      this._sub.then((es) => {
        es.close();
      });
    }
  }
}
