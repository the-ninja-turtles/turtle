import Reflux from 'reflux';

export const DashboardActions = Reflux.createActions({
  'fetchProjects': {asyncResult: true},
  'createProject': {asyncResult: true}
});

export const CreateTaskActions = Reflux.createActions({
  'createTask': {asyncResult: true}
});

export const SprintActions = Reflux.createActions({
  'fetchSprint': {asyncResult: true},
  'updateTaskStatusLocally': {},
  'updateTaskStatusOnServer': {asyncResult: true},
  'reorderTasksLocally': {},
  'reorderTasksOnServer': {asyncResult: true}
});

export const ProjectActions = Reflux.createActions({
  'fetchProject': {asyncResult: true},
  'addTaskToNextSprintLocally': {},
  'addTaskToNextSprintOnServer': {asyncResult: true},
  'addTaskToBacklogLocally': {},
  'addTaskToBacklogOnServer': {asyncResult: true},
  'moveTask': {},
  'updateTaskPositionOnServer': {asyncResult: true}
});

export const UserActions = Reflux.createActions({
  'loggedIn': {},
  'loggedOut': {}
});
