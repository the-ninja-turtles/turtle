import _ from 'lodash';
import Reflux from 'reflux';
import projects from '../ajax/projects';
import {ProjectActions} from '../actions/actions';
import {MockProject as mockProject} from './mock-data';

let cachedProject;
let switchedTask;

const ProjectStore = Reflux.createStore({
  listenables: ProjectActions,

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

  onAddTaskToNextSprintLocally(id) {
    let project = cachedProject;
    let draggedTaskInfo = this.findTask(id);
    let draggedTask = draggedTaskInfo.task;
    let draggedTaskContainer = draggedTaskInfo.container;
    if (_.isEqual(draggedTaskContainer, project.backlog)) {
      draggedTaskContainer.splice(draggedTaskContainer.indexOf(draggedTask), 1);
      project.nextSprint.tasks.push(draggedTask);
      this.trigger(project);
    }
  },

  onAddTaskToNextSprintOnServer(id) {
    let project = cachedProject;
    let draggedTask = this.findTask(id).task;
    if (!draggedTask.sprintId) {
      draggedTask.sprintId = project.nextSprint.id;
      // send ajax request to server to update either the project or all project’s tasks; cache the result
    }
  },

  onAddTaskToBacklogLocally(id) {
    let project = cachedProject;
    let draggedTaskInfo = this.findTask(id);
    let draggedTask = draggedTaskInfo.task;
    let draggedTaskContainer = draggedTaskInfo.container;
    if (_.isEqual(draggedTaskContainer, project.nextSprint.tasks)) {
      draggedTaskContainer.splice(draggedTaskContainer.indexOf(draggedTask), 1);
      project.backlog.unshift(draggedTask);
      this.trigger(project);
    }
  },

  onAddTaskToBacklogOnServer(id) {
    let draggedTask = this.findTask(id).task;
    if (draggedTask.sprintId) {
      draggedTask.sprintId = null;
      // send ajax request to server
    }
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
  },

  findTask(id) {
    let project = cachedProject;
    let task;
    // check whether the task is in the next sprint
    task = _.findWhere(project.nextSprint.tasks, {id: id});
    if (task) {
      return {
        task: task,
        container: project.nextSprint.tasks
      };
    }
    // otherwise it must be in the backlog (but check that with an if, just in case)
    task = _.findWhere(project.backlog, {id: id});
    if (task) {
      return {
        task: task,
        container: project.backlog
      };
    }
  }

});

export default ProjectStore;
