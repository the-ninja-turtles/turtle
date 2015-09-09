import React from 'react/addons';
import Router from 'react-router';
import App from './components/app.jsx';
import Home from './components/home/home.jsx';
import Dashboard from './components/dashboard/dashboard.jsx';
import SprintBoard from './components/sprintboard/board.jsx';
import Project from './components/project/project.jsx';


let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;
// -- WE MAY NEED THIS AT SOME LATER POINT FOR A 404 page:
// let NotFoundRoute = Router.NotFoundRoute;

let routes = (
  <Route name='app' path='/' handler={App}>
    <DefaultRoute handler={Home} />
    <Route name='dashboard' handler={Dashboard} />
    <Route name='sprint' handler={SprintBoard} />
    <Route name='project' path='project/:id' handler={Project} />
  </Route>
);

export default routes;
