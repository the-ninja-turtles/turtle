import _ from 'lodash';
import Reflux from 'reflux';
import {SprintActions, TaskActions} from '../actions/actions';
// import {mockSprints} from '../../tests/utils/fake.js';
// let mockSprint = mockSprints(1, 3)[0];
import {MockSprint as mockSprint} from './mock-data';


const SprintStore = Reflux.createStore({
  listenables: [SprintActions, TaskActions],

  columns: ['To Do', 'In Progress', 'Review', 'Done'],

  onFetchSprint() {
    // simulating asynchronous nature of fetching a sprint
    Promise.resolve(mockSprint).then((sprint) => {
      this.transformSprint(sprint);
      this.sprint = sprint; // cache sprint locally
      this.trigger(this.sprint);
    });
  },

  transformSprint(sprint) {
    sprint.columns = {};
    sprint.tasksByColumn = {};
    this.columns.forEach((column, index) => {
      sprint.columns[index] = column;
      let tasksForColumn = _.where(sprint.tasks, {status: index});
      sprint.tasksByColumn[index] = tasksForColumn;
    });
  },

  onUpdateTaskStatusLocally(params) {
    let sprint = this.sprint;
    let taskInfo = this.findTask(params.taskId);
    let task = taskInfo.task;
    let oldColumn = taskInfo.container;
    let newColumn = sprint.tasksByColumn[params.newStatus];
    if (task) {
      oldColumn.splice(oldColumn.indexOf(task), 1);
      newColumn.push(task);
      this.trigger(sprint);
    }
  },

  onUpdateTaskStatusOnServer(params) {
    let task = this.findTask(params.taskId).task;
    task.status = params.newStatus;
    // send a request to the server with updated status of the task
  },

  onReorderTasksLocally(params) {
    let draggedTaskInfo = this.findTask(params.draggedTaskId);
    let draggedTask = draggedTaskInfo.task;
    let draggedTaskContainer = draggedTaskInfo.container;
    let targetTaskInfo = this.findTask(params.targetTaskId);
    let targetTask = targetTaskInfo.task;
    let targetTaskContainer = targetTaskInfo.container;
    draggedTaskContainer.splice(draggedTaskContainer.indexOf(draggedTask), 1);
    targetTaskContainer.splice(targetTaskContainer.indexOf(targetTask), 0, draggedTask);
    this.trigger(this.sprint);
  },

  onReorderTasksOnServer() {
    console.log('sending request to server');
    let tasksArray = [];
    // just to avoid any surprizes when iterating over a JS object by keys
    // get an array of keys and sort it
    let columnIds = _.sortBy(Object.keys(this.sprint.tasksByColumn));
    _.forEach(columnIds, (id) => {
      tasksArray = tasksArray.concat(this.sprint.tasksByColumn[id]);
    });
    // send the new array of tasks back to the server
  },

  findTask(id) {
    let columns = this.sprint.tasksByColumn;
    let taskInfo = {};
    _.forEach(columns, (column) => {
      let task = _.findWhere(column, {id: id});
      if (task) {
        taskInfo.task = task;
        taskInfo.container = column;
      }
    });
    return taskInfo;
  }

});

export default SprintStore;
