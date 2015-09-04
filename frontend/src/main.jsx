import React from 'react/addons';
import Router from 'react-router';
import routes from './routes.jsx';

Router.run(routes, Router.HistoryLocation, (Handler) => {
  React.render(<Handler/>, document.body);
});
