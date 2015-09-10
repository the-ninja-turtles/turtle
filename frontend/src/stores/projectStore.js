import _ from 'lodash';
import Reflux from 'reflux';
import {ProjectActions} from '../actions/actions';
import {MockProject as mockProject} from './mock-data';

let cachedProject;
let switchedTask;

const ProjectStore = Reflux.createStore({
  listenables: ProjectActions,

  onFetchProject(id) {
    // simulating asynchronous nature of fetching a project
    Promise.resolve(mockProject).then((project) => {
      cachedProject = project;
      this.trigger(project);
    });
  },

  onAddTaskToNextSprintLocally(id) {
    let project = cachedProject;
    let task = _.findWhere(project.tasks, {id: id});
    let nextSprint = _.findWhere(project.sprints, {status: 'Not Started'});
    task.sprintId = nextSprint.id;
    this.trigger(project);
  },

  onAddTaskToNextSprintOnServer(id) {
    // send ajax request to server to update either the project or all project’s tasks; cache the result
  },

  onUpdateTaskRankLocally(params) {
    let project = cachedProject;
    let draggedTask = _.findWhere(project.tasks, {id: params.draggedTaskId});
    let targetTask = _.findWhere(project.tasks, {id: params.targetTaskId});
    project.tasks.splice(project.tasks.indexOf(draggedTask), 1);
    project.tasks.splice(project.tasks.indexOf(targetTask), 0, draggedTask);
    // tasks change places during hover, so now I am hovering over draggedTask
    // information about the task with which draggedTask swapped places will be stored in a global variable
    switchedTask = targetTask;
    this.trigger(project);
  },

  onUpdateTaskRankOnServer(params) {
    let project = cachedProject;
    let draggedTask = _.findWhere(project.tasks, {id: params.draggedTaskId});
    // a task will always be dropped on itself; but what it hasn't swapped with another task?
    // checking this in the next line
    let targetTask = switchedTask ? switchedTask : draggedTask;
    let temp = draggedTask.rank;
    draggedTask.rank = targetTask.rank;
    targetTask.rank = temp;
    // send ajax request to server to update either the project or all project’s tasks; cache the result
    this.trigger(project);
  }

});

export default ProjectStore;
