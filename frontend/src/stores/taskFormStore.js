import _ from 'lodash';
import Reflux from 'reflux';
import projects from '../ajax/projects';
import {ProjectActions, TaskFormActions} from '../actions/actions';

let TaskFormStore = Reflux.createStore({
  listenables: [ProjectActions, TaskFormActions],

  onCreateTask() {
    this.trigger({action: 'create'});
  },

  onSaveTask(id, properties) {
    projects.id(id).tasks.create(_.pick(properties, 'name', 'score', 'description', 'userId', 'sprintId')).then((response) => {
      if (!response.error) {
        this.trigger({success: true});
      }
    });
  },

  onEditTask(params) {
    this.trigger(params);
  },

  onUpdateTask(params) {
    projects.id(params.projectId).tasks.id(params.taskId).update(params.taskProperties).then((response) => {
      if (!response.error) {
        this.trigger({success: true});
      }
    });
  },

  onDeleteTask(params) {
    // console.log('params', params);
    projects.id(params.projectId).tasks.id(params.taskId).delete().then((response) => {
      if (!response) {
        this.trigger({success: true});
      }
    });
  }

});

export default TaskFormStore;
