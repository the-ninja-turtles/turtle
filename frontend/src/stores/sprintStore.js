import _ from 'lodash';
import Reflux from 'reflux';
import {SprintActions, TaskActions} from '../actions/actions';
import projects from '../ajax/projects.js';

const SprintStore = Reflux.createStore({
  listenables: [SprintActions, TaskActions],

  columns: ['To Do', 'In Progress', 'Review', 'Done'],

  onOpenTaskForm() {
    this.trigger({
      showModal: true
    });
  },

  onLoadSprint(project) {
    this.project = project;
    this.sprint = project.currentSprint;

    this.fillColumns();
    this.trigger({
      users: project.users,
      sprint: this.sprint
    });
  },

  fillColumns() {
    this.sprint.columns = this.columns;
    let tasksByColumn = _.map(new Array(this.columns.length), () => {
      return [];
    });
    _.each(this.sprint.tasks, (task) => {
      tasksByColumn[task.status] = tasksByColumn[task.status] || [];
      tasksByColumn[task.status].push(task);
    });
    this.sprint.tasksByColumn = tasksByColumn;
  },

  onUpdateTaskStatusLocally(params) {
    let task = this.findTask(params.taskId);
    if (task) {
      task.container.splice(task.container.indexOf(task), 1);
      this.sprint.tasksByColumn[params.newStatus].push(task);
      this.trigger({sprint: this.sprint});
    }
  },

  onUpdateTaskOnServer(taskId, newStatus) {
    let task = this.findTask(taskId);
    new Promise((resolve) => {
      if (task.status === newStatus) {
        return resolve();
      }
      return projects.id(this.project.id).tasks.id(task.id).update({status: newStatus}).then(resolve);
    })
    .then(() => {
      console.log('reordering 123');
      let tasks = _.flatten(this.sprint.tasksByColumn);
      let ids = _.pluck(tasks, 'id');
      let index = _.indexOf(ids, taskId);
      return projects.id(this.project.id).sprints.id(this.sprint.id).positions({id: taskId, index: index});
    });
  },

  onReorderTasksLocally(params) {
    let draggedTask = this.findTask(params.draggedTaskId);
    let targetTask = this.findTask(params.targetTaskId);
    draggedTask.container.splice(draggedTask.container.indexOf(draggedTask), 1);
    targetTask.container.splice(targetTask.container.indexOf(targetTask), 0, draggedTask);
    this.trigger({sprint: this.sprint});
  },

  findTask(id) {
    let taskInfo = {};
    _.each(this.sprint.tasksByColumn, (column) => {
      let task = _.findWhere(column, {id: id});
      if (task) {
        taskInfo = task;
        taskInfo.container = column;
      }
    });
    return taskInfo;
  }

});

export default SprintStore;
