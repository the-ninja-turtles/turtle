import React from 'react/addons';
import Router from 'react-router';
import App from './components/app.jsx.js';
import Home from './components/home/home.jsx.js';
import SprintBoard from './components/sprintboard/board.jsx.js';

let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;
// -- WE MAY NEED THIS AT SOME LATER POINT FOR A 404 page:
// let NotFoundRoute = Router.NotFoundRoute;

let routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={Home} />
    <Route name="sprint" handler={SprintBoard} />
  </Route>
);

export default routes;
