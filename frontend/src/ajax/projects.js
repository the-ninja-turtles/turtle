import _ from 'lodash';
import {request} from './ajax.js';
import Subscription from './subscription.js';

// A resource has a name and sub resources
let Resource = function(name, resources) {
  this.name = name;
  this.resources = resources || [];
  this.actions = {};
};

Resource.prototype.define = function(name, method) {
  this.actions[name] = method;
  return this;
};

let Collection = function(resource, parent) {
  this.resource = resource;
  this.parent = parent;
};

Collection.prototype.id = function(id) {
  return new Model(this, id);
};

Collection.prototype.create = function(data) {
  return request('POST', this._path(), data);
};

Collection.prototype.fetch = function() {
  return request('GET', this._path());
};

Collection.prototype._path = function() {
  let path = this.parent ? this.parent._path() : '';
  return path + '/' + this.resource.name;
};


let Model = function(parent, id) {
  let self = this;
  this.parent = parent;
  this.id = id;

  _.each(parent.resource.resources, (resource) => {
    Object.defineProperty(self, resource.name, {
      get: () => {
        return new Collection(resource, self);
      }
    });
  });


  _.each(parent.resource.actions, (method, name) => {
    if (_.isString(method)) {
      self[name] = ((m, n, data) => {
        request(m, self._path() + '/' + n, data);
      }).bind(null, method, name);
    } else {
      self[name] = method;
    }
  });
};

Model.prototype.fetch = function() {
  return request('GET', this._path());
};

Model.prototype.update = function(data) {
  return request('PUT', this._path(), data);
};

Model.prototype.delete = function() {
  return request('DELETE', this._path());
};

Model.prototype._path = function() {
  return this.parent._path() + '/' + this.id;
};


// subscriptions
let subscription = new Subscription();

let on = (collection, event, callback) => {
  subscription.on(collection + ':' + event, callback);
};

// resources
let tasks = new Resource('tasks');
let sprints = new Resource('sprints').define('assigntasks', 'POST');
let projects = new Resource('projects', [tasks, sprints]).define('on', on.bind(null, 'project'));

let root = new Collection(projects);

root.id = function(id) {
  subscription.subscribe(this.resource.name, id);
  return Collection.prototype.id.call(this, id);
};
root.on = undefined;
export default root;


Collection.prototype.on = function(event, callback) {
  let events = {
    'tasks': 'task',
    'sprints': 'sprint'
  };
  on(events[this.resource.name], event, callback);
};
