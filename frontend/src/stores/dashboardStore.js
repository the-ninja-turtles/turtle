import Reflux from 'reflux';
import projects from '../ajax/projects';
import {DashboardActions as Actions, EventActions} from '../actions/actions';

let DashboardStore = Reflux.createStore({
  listenables: Actions,

  init() {
    this.projects = [];
    projects.on('add', (data) => {
      this.projects.push(data);
      this.trigger(this.projects);
      EventActions.notify('project:add');
    });
  },

  onFetchProjects() {
    projects.fetch().then((projects) => {
      this.projects = projects;
      this.trigger(this.projects);
    });
  },

  onCreateProject(name, cb) {
    projects.create({name: name})
      .then((response) => {
        if (!response.error) {
          return projects.id(response.id).sprints.create({
            name: 'Upcoming',
            status: 'Not Started',
            startDate: new Date(),
            endDate: new Date()
          });
        }
      })
      .then((response) => {
        if (!response.error) {
          cb(response);
        }
      });
  }
});

export default DashboardStore;
