import Reflux from 'reflux';

export const DashboardActions = Reflux.createActions({
  fetchProjects: {},
  createProject: {},
  deleteProject: {}
});

export const SprintActions = Reflux.createActions({
  fetchSprint: {},
  updateTaskStatusLocally: {},
  updateTaskStatusOnServer: {},
  reorderTasksLocally: {},
  reorderTasksOnServer: {}
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
  updateTaskPosLocally: {},
  updateTaskPosOnServer: {}
});

export const TaskContainerActions = Reflux.createActions({
  addTaskToContainerLocally: {},
  addTaskToContainerOnServer: {}
});

export const TaskFormActions = Reflux.createActions({
  createTask: {},
  saveTask: {},
  editTask: {},
  updateTask: {}
});
