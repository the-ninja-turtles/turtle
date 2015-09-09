import {origin} from './ajax.js';
import auth from '../auth/auth.js';

class Subscription {

  subscribe(namespace, room) {
    if (this.namespace !== namespace && this.room !== room) {
      this.namespace = namespace;
      this.room = room;

      this.close();

      this._sub = auth().token().then((token) => {
        let url = origin('events', 4000) + '/subscribe/' + namespace + '/' + room + '/' + token;
        return new EventSource(url);
      });
    }
  }

  on(event, callback) {
    if (this._sub) {
      this._sub.then((es) => {
        es.addEventListener(event, callback, false);
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

export default new Subscription();
