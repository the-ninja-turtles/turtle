import Reflux from 'reflux';

export const DashboardActions = Reflux.createActions({
  'fetchProjects': {asyncResult: true},
  'createProject': {asyncResult: true}
});
