import Reflux from 'reflux';
import projects from '../ajax/projects';
import {DashboardActions as Actions} from '../actions/actions';

let DashboardStore = Reflux.createStore({
  listenables: Actions,

  onFetchProjects() {
    projects.fetch().then((projects) => {
      this.trigger(projects);
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
