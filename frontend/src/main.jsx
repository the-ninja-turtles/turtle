import React from 'react';
import Router from 'react-router';
import App from './components/app.jsx';
import Dashboard from './components/dashboard/dashboard.jsx';
import SprintBoard from './components/sprintboard/board.jsx';
import Project from './components/project/project.jsx';

let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;

let routes = (
  <Route name='app' path='/' handler={App}>
    <DefaultRoute handler={Dashboard} />
    <Route name='sprint' handler={SprintBoard} />
    <Route name='project' path='project/:id' handler={Project} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, (Handler) => {
  React.render(<Handler/>, document.getElementById('root'));
});
