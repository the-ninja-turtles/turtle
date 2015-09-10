import React from 'react';
import Reflux from 'reflux';
import {Navigation} from 'react-router';
import Backlog from './backlog.jsx';
import CreateSprint from './createSprint.jsx';
import {ProjectActions as Actions} from '../../actions/actions';
import projectStore from '../../stores/projectStore';
// import {mockProjects} from '../../../tests/utils/fake.js';

let Project = React.createClass({
  mixins: [Navigation, Reflux.ListenerMixin],

  getInitialState() {
    return {
      id: parseInt(this.props.params.id),
      project: {
        users: [],
        sprints: [],
        tasks: []
      }
    };
  },

  componentDidMount() {
    this.listenTo(projectStore, this.onStoreUpdate);
    Actions.fetchProject(this.state.id);
  },

  onStoreUpdate(project) {
    this.setState({project: project});
  },

  render() {
    return (
      <div className='project-view'>
        <CreateSprint />
        <hr />
        <Backlog
          projectId={this.state.id}
          users={this.state.project.users}
          tasks={this.state.project.tasks}
        />
      </div>
    );
  }

});

export default Project;
