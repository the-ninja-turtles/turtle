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
    projects.create({name: name}).then((response) => {
      cb(response);
    });
  }
});

export default DashboardStore;
