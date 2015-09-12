import _ from 'lodash';
import {origin} from './ajax.js';
import auth from '../auth/auth.js';

export default class Subscription {

  constructor(namespace) {
    this._sub = auth().token().then((token) => {
      let url = origin('events', 4000) + '/subscribe/' + namespace + '/' + token;
      return new EventSource(url);
    });
  }

  on(resource, event, callback, filter) {
    filter = filter || _.identity;
    if (this._sub) {
      this._sub.then((es) => {
        es.addEventListener(resource + ':' + event, (e) => {
          let data = JSON.parse(e.data);
          filter(data) && callback(data);
        }, false);
      });
    }
  }

  close() {
    if (this._sub) {
      this._sub.then((es) => {
        es.close();
      });
    }
  }
}
