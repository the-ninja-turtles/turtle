import Reflux from 'reflux';
import projects from '../ajax/projects';
import {ProjectActions as Actions} from '../actions/actions';

let ProjectStore = Reflux.createStore({
  listenables: Actions,

  onFetchProject(id) {
    projects.id(id).fetch().then((project) => {
      this.trigger(project);
    });
  }
});

export default ProjectStore;
