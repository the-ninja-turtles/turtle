import React from 'react';
import Reflux from 'reflux';
import {ProjectActions, NavbarActions} from '../../actions/actions.js';
import ProjectStore from '../../stores/projectStore';

import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';

import SprintStats from './sprintStats.jsx';
import NextSprint from './nextSprint.jsx';
import Backlog from './backlog.jsx';

let Project = React.createClass({
  mixins: [Reflux.ListenerMixin],

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
    this.setState({project: project});
  },

  render() {
    let current = () => {
      if (this.state.project.currentSprint && this.state.project.currentSprint.startDate) {
        NavbarActions.setHasCurrentSprint(true);
        return (
          <div className='current-sprint two-thirds'>
            <SprintStats project={this.state.id} sprint={this.state.project.currentSprint} length={this.state.project.length} />
          </div>
        );
      } else {
        NavbarActions.setHasCurrentSprint(false);
      }
    };

    return (
      <div className='fill'>
        {current()}
        <div className='flex-container'>
          <div className='flex-container-item half'>
            <Backlog project={this.state.id} tasks={this.state.project.backlog} users={this.state.project.users} />
          </div>
          <div className='flex-container-item half'>
            <NextSprint tasks={this.state.project.nextSprint.tasks} users={this.state.project.users} />
          </div>
        </div>
      </div>
    );
  }
});

export default DragDropContext(HTML5Backend)(Project);
