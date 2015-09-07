import React from 'react/addons';
import {Navigation} from 'react-router';
import Reflux from 'reflux';
import Project from './project.jsx';
import {DashboardActions as Actions} from '../../actions/actions.js';
import dashboardStore from '../../stores/dashboardStore.js';

let Dashboard = React.createClass({
  mixins: [Navigation, Reflux.ListenerMixin],

  getInitialState() {
    return {
      projects: []
    };
  },

  // listen to data changes from `dashboardStore`
  // `listen` returns a convenient unsubscribe functor
  componentDidMount() {
    this.listenTo(dashboardStore, this.onProjectsFetched);
    Actions.fetchProjects();
  },

  onProjectsFetched(projects) {
    this.setState({projects: projects});
  },

  enterProject(id) {
    this.transitionTo('overview', {
      id: id
    });
  },

  createProject() {
    Actions.createProject();
  },

  render() {
    return (
      <div className='dashboard'>
        <ul>
          <Project key='0' id='0' name='+ New Project' click={this.createProject} />
          {
            this.state.projects.map((project) => {
              return <Project key={project.id} id={project.id} name={project.name}  click={this.enterProject} />;
            })
          }
        </ul>
      </div>
    );
  }
});

export default Dashboard;
