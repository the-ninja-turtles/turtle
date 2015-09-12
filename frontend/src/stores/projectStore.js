import _ from 'lodash';
import Reflux from 'reflux';
import projects from '../ajax/projects';
import {ProjectActions, TaskActions} from '../actions/actions';
import {MockProject as mockProject} from './mock-data';

let cachedProject;
let switchedTask;

const ProjectStore = Reflux.createStore({
  listenables: [ProjectActions, TaskActions],

  onFetchProject(id) {
    // // simulating asynchronous nature of fetching a project
    Promise.resolve(mockProject).then((project) => {
      cachedProject = project;
      this.trigger(project);
    });
    // projects.id(id).fetch().then((project) => {
    //   cachedProject = project;
    //   this.trigger(project);
    // });
  },

  onUpdateTaskPosLocally(params) {
    let project = cachedProject;

    if (!project) {
      return;
    }

    let findTask = (taskId) => {
      let task = _.findWhere(project.backlog, {id: taskId});
      if (task) {
        task.container = project.backlog;
        return task;
      }
      task = _.findWhere(project.nextSprint.tasks, {id: taskId});
      if (task) {
        task.container = project.nextSprint.tasks;
        return task;
      }
    };

    let draggedTask = findTask(params.draggedTaskId);
    let targetTask = findTask(params.targetTaskId);

    if (draggedTask && targetTask) {
      // remove the dragged task from its previous place in the tasks array
      draggedTask.container.splice(draggedTask.container.indexOf(draggedTask), 1);

      // and then insert the dragged task before the target task
      targetTask.container.splice(targetTask.container.indexOf(targetTask), 0, draggedTask);

      this.trigger(project);
    }
  },

  onUpdateTaskPosOnServer(params) {
    /*let project = cachedProject;
    let draggedTask = this.findTask(params.taskId).task;
    if (!draggedTask.sprintId) {
      draggedTask.sprintId = project.nextSprint.id;
      // send ajax request to server to update either the project or all project’s tasks; cache the result
    }*/
  },

  onMoveTask(params) {
    let project = cachedProject;
    // find tasks in the project and arrays that contain them
    let draggedTaskInfo = this.findTask(params.draggedTaskId);
    let draggedTask = draggedTaskInfo.task;
    let draggedTaskContainer = draggedTaskInfo.container;
    let targetTaskInfo = this.findTask(params.targetTaskId);
    let targetTask = targetTaskInfo.task;
    let targetTaskContainer = targetTaskInfo.container;
    // find the arrays containing these tasks
    draggedTaskContainer.splice(draggedTaskContainer.indexOf(draggedTask), 1);
    targetTaskContainer.splice(targetTaskContainer.indexOf(targetTask), 0, draggedTask);
    this.trigger(project);
  },

  onUpdateTaskPositionOnServer(params) {
    // let project = cachedProject;
    // let draggedTask = _.findWhere(project.tasks, {id: params.draggedTaskId});
    // // a task will always be dropped on itself; but what it hasn't swapped with another task?
    // // checking this in the next line
    // let targetTask = switchedTask ? switchedTask : draggedTask;
    // let temp = draggedTask.rank;
    // draggedTask.rank = targetTask.rank;
    // targetTask.rank = temp;
    // // send ajax request to server to update either the project or all project’s tasks; cache the result
    // this.trigger(project);
  }

});

export default ProjectStore;
