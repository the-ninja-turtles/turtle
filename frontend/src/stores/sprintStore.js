import _ from 'lodash';
import Reflux from 'reflux';
import {SprintActions, TaskActions} from '../actions/actions';
// import {mockSprints} from '../../tests/utils/fake.js';
// let mockSprint = mockSprints(1, 3)[0];
import {MockSprint as mockSprint} from './mock-data';

let cachedSprint;

const SprintStore = Reflux.createStore({
  listenables: [SprintActions, TaskActions],

  onFetchSprint() {
    // simulating asynchronous nature of fetching a sprint
    Promise.resolve(mockSprint).then((sprint) => {
      cachedSprint = sprint;
      this.trigger(sprint);
    });
  },

  onUpdateTaskStatus(params) {
    let sprint = mockSprint;
    let task = _.findWhere(sprint.tasks, {id: params.taskId});
    task.status = params.newStatus;
    this.trigger(sprint);
  },

  onUpdateTaskPosLocally(params) {
    let sprint = cachedSprint;

    if (!sprint) {
      return;
    }

    let draggedTask = _.findWhere(sprint.tasks, {id: params.draggedTaskId});
    let targetTask = _.findWhere(sprint.tasks, {id: params.targetTaskId});

    if (draggedTask && targetTask) {
      draggedTask.status = targetTask.status;

      // remove the dragged task from its previous place in the tasks array
      sprint.tasks.splice(sprint.tasks.indexOf(draggedTask), 1);

      // and then insert the dragged task before the target task
      sprint.tasks.splice(sprint.tasks.indexOf(targetTask), 0, draggedTask);

      this.trigger(sprint);
    }
  },

  onUpdateTaskPosOnServer(params) {
    let sprint = cachedSprint;
    if (!sprint) {
      return;
    }
    let draggedTask = _.findWhere(sprint.tasks, {id: params.draggedTaskId});
    let targetTask = _.findWhere(sprint.tasks, {id: params.targetTaskId});
    draggedTask.rank = targetTask.rank;
    for (let i = sprint.tasks.indexOf(targetTask); i < sprint.tasks.length; i++) {
      sprint.tasks[i].rank++;
    }
    // send ajax request to server to update either the sprint or all of sprint's tasks
    console.log('pretending to send a request to the server');
  }

});

export default SprintStore;
