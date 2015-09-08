import Reflux from 'reflux';

export const DashboardActions = Reflux.createActions({
  'fetchProjects': {asyncResult: true},
  'createProject': {asyncResult: true}
});

export const SprintActions = Reflux.createActions({
  'fetchSprint': {asyncResult: true},
  'updateTaskStatus': {asyncResult: true},
  'updateTaskRankLocally': {},
  'updateTaskRankOnServer': {asyncResult: true}
});
