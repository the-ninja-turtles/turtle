import Reflux from 'reflux';

export const DashboardActions = Reflux.createActions({
  fetchProjects: {},
  createProject: {},
  deleteProject: {}
});

export const SprintActions = Reflux.createActions({
  loadSprint: {},
  updateTaskStatusLocally: {},
  reorderTasksLocally: {},
  updateTaskOnServer: {}
});

export const ProjectActions = Reflux.createActions({
  fetchProject: {},
  startSprint: {},
  endSprint: {}
});

export const UserActions = Reflux.createActions({
  loggedIn: {},
  loggedOut: {}
});

export const NavbarActions = Reflux.createActions({
  setHasCurrentSprint: {}
});

export const EventActions = Reflux.createActions({
  notify: {}
});

export const TaskActions = Reflux.createActions({
  updateTaskPosLocally: {}
});

export const TaskContainerActions = Reflux.createActions({
  addTaskToContainerLocally: {},
  addTaskToContainerOnServer: {},
  updateTaskOnServer: {}
});

export const TaskFormActions = Reflux.createActions({
  createTask: {},
  saveTask: {},
  editTask: {},
  updateTask: {},
  deleteTask: {}
});
