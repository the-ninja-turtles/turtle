import _ from 'lodash';
import Reflux from 'reflux';
import projects from '../ajax/projects';
import {DashboardActions as Actions, EventActions} from '../actions/actions';

let DashboardStore = Reflux.createStore({
  listenables: Actions,

  init() {
    this.projects = [];
    projects.on('add', (event) => {
      EventActions.notify(event);
      this.projects.push(event);
      this.trigger(this.projects);
    });

    projects.on('delete', (event) => {
      EventActions.notify(event);
    });
  },

  onFetchProjects() {
    projects.fetch().then((projects) => {
      this.projects = projects;
      this.trigger(this.projects);
    });
  },

  onCreateProject(name, emails, cb) {
    projects.create({name: name, emails: emails || []}).then(cb);
  },

  onDeleteProject(id) {
    projects.id(id).delete().then(() => {
      let project = _.findWhere(this.projects, {id: id});
      let index = _.indexOf(this.projects, project);
      this.projects.splice(index, 1);
      this.trigger(this.projects);
    });
  }

});

export default DashboardStore;
