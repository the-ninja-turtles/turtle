import _ from 'lodash';
import {request} from './ajax.js';
import Subscription from './subscription.js';


let subscription = _.once(() => {
  return new Subscription('projects');
});


let Resource = function(name, singular, resources) {
  this.name = name;
  this.singular = singular;
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

Collection.prototype.on = function(event, callback) {
  let self = this;
  subscription().on(self.resource.singular, event, callback, (data) => {
    return !self.parent || self.parent.id === data[self.parent.singular + '_id'];
  });
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

Model.prototype.on = function(event, callback) {
  let self = this;
  subscription().on(self.parent.resource.singular, event, callback, (data) => {
    return self.id === data.id;
  });
};


let tasks = new Resource('tasks', 'task');
let sprints = new Resource('sprints', 'sprint').define('assigntasks', 'POST');
let projects = new Resource('projects', 'project', [tasks, sprints]);

export default new Collection(projects);
