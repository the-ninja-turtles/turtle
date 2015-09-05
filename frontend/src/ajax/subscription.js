import {origin} from './ajax.js';

export default class Subscription {

  subscribe(namespace, room) {
    if (this.namespace !== namespace && this.room !== room) {
      this.namespace = namespace;
      this.room = room;

      this.close();

      let url = origin(4000) + '/subscribe/' + namespace + '/' + room + '/' + localStorage.getItem('userToken');
      this._eventSource = new EventSource(url);
    }
  }

  on(event, cb) {
    this._eventSource.addEventListener(event, cb, false);
  }

  close() {
    if (this._eventSource && this._eventSource.close) {
      this._eventSource.close();
    }
  }
}
