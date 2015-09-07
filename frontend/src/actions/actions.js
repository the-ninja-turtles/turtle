import Reflux from 'reflux';


export const TestActions = Reflux.createActions({
  // user actions
  'loggedIn': {}
});

export const DashboardActions = Reflux.createActions({
  'fetchProjects': {asyncResult: true},
  'createProject': {asyncResult: true}
});
