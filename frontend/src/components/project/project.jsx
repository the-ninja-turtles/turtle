import React from 'react';
import Reflux from 'reflux';
import {Navigation} from 'react-router';
import {ProjectActions} from '../../actions/actions';
import ProjectStore from '../../stores/projectStore';

import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';

import CurrentSprint from './currentSprint.jsx';
import NextSprint from './nextSprint.jsx';
import Backlog from './backlog.jsx';

let Project = React.createClass({
  mixins: [
    Navigation,
    Reflux.ListenerMixin
  ],

  getInitialState() {
    return {
      id: parseInt(this.props.params.id),
      project: {
        users: [],
        currentSprint: {
          tasks: []
        },
        nextSprint: {
          tasks: []
        },
        backlog: []
      }
    };
  },

  componentDidMount() {
    this.listenTo(ProjectStore, this.onStoreUpdate);
    ProjectActions.fetchProject(this.state.id);
  },

  onStoreUpdate(project) {

    this.setState({project});
  },

  render() {
    return (
      <div className='project-view'>
        <CurrentSprint project={this.state.id} sprint={this.state.currentSprint} />
        <hr />
        <NextSprint project={this.state.id} tasks={this.state.project.nextSprint.tasks} users={this.state.project.users} />
        <hr />
        <Backlog project={this.state.id} tasks={this.state.project.backlog} users={this.state.project.users} />
      </div>
    );
  }
});

export default DragDropContext(HTML5Backend)(Project);
