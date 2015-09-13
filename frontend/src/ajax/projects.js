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
  this.collectionActions = {};
  this.modelActions = {};
};

Resource.prototype.define = function(name, onModel, method) {
  method = method || 'POST';
  let fn = method;

  if (_.isString(method)) {
    fn = function(data) {
      return request(method, this._path() + '/' + name, data);
    };
  }

  if (onModel) {
    this.modelActions[name] = fn;
  } else {
    this.collectionActions[name] = fn;
  }
  return this;
};


let Collection = function(resource, parent) {
  this.resource = resource;
  this.parent = parent;

  _.each(this.resource.collectionActions, (method, name) => {
    this[name] = method.bind(this);
  });
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
  this.parent = parent;
  this.id = id;

  _.each(parent.resource.resources, (resource) => {
    Object.defineProperty(this, resource.name, {
      get: () => {
        return new Collection(resource, this);
      }
    });
  });

  _.each(parent.resource.modelActions, (method, name) => {
    this[name] = method.bind(this);
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
let sprints = new Resource('sprints', 'sprint')
  .define('start')
  .define('end')
  .define('positions', true)
  .define('assigntasks', true);
let projects = new Resource('projects', 'project', [tasks, sprints])
  .define('positions');

export default new Collection(projects);
