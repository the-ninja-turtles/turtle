import Reflux from 'reflux';
import projects from '../ajax/projects';
import {CreateTaskActions as Actions} from '../actions/actions';

let CreateTaskStore = Reflux.createStore({
  listenables: Actions,

  onCreateTask(id, properties) {
    console.log(id, properties);
    projects.id(id).tasks.create(properties).then((response) => {
      this.trigger(response);
    });
  }
});

export default CreateTaskStore;
