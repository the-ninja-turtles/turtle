import Reflux from 'reflux';

export const DashboardActions = Reflux.createActions({
  fetchProjects: {},
  createProject: {},
  deleteProject: {}
});

export const SprintActions = Reflux.createActions({
  openCreateTask: {},
  fetchSprint: {},
  updateTaskStatusLocally: {},
  updateTaskStatusOnServer: {},
  reorderTasksLocally: {},
  reorderTasksOnServer: {}
});

export const ProjectActions = Reflux.createActions({
  fetchProject: {},
  createTask: {},
  startSprint: {},
  endSprint: {}
});

export const UserActions = Reflux.createActions({
  loggedIn: {},
  loggedOut: {}
});

export const NavbarActions = Reflux.createActions({
  showStartSprintBtn: {},
  showEndSprintBtn: {}
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
