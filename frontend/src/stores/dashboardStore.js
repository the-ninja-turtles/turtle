import Reflux from 'reflux';
import projects from '../ajax/projects';
import {DashboardActions as Actions} from '../actions/actions';

let DashboardStore = Reflux.createStore({
  init() {
    this.listenTo(Actions.fetchProjects, this.onFetchProjects);
    this.listenTo(Actions.createProject, this.onCreateProject);
  },
  onFetchProjects() {
    projects.fetch().then((projects) => {
      this.trigger(projects);
    });
  },
  onCreateProject(name) {
    projects.create({name: name}).then((project) => {
      Actions.fetchProjects();
    });
  }
});

export default DashboardStore;
