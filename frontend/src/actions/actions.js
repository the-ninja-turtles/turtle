import Reflux from 'reflux';

export const DashboardActions = Reflux.createActions({
  'fetchProjects': {asyncResult: true},
  'createProject': {asyncResult: true},
  'deleteProject': {asyncResult: true}
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
  'moveTask': {}
});

export const UserActions = Reflux.createActions({
  'loggedIn': {},
  'loggedOut': {}
});

export const EventActions = Reflux.createActions({
  'notify': {}
});

export const TaskActions = Reflux.createActions({
  'updateTaskPosLocally': {},
  'updateTaskPosOnServer': {asyncResult: true}
});

export const TaskContainerActions = Reflux.createActions({
  'addTaskToContainerLocally': {},
  'addTaskToContainerOnServer': {asyncResult: true}
});
