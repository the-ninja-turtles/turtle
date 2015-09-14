import _ from 'lodash';
import Reflux from 'reflux';
import projects from '../ajax/projects';
import {ProjectActions} from '../actions/actions';

let CreateTaskStore = Reflux.createStore({
  listenables: ProjectActions,

  onCreateTask(id, properties) {
    projects.id(id).tasks.create(_.pick(properties, 'name', 'score', 'description', 'userId', 'sprintId')).then((response) => {
      this.trigger(response);
    });
  }
});

export default CreateTaskStore;
