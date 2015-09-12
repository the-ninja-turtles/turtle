import _ from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import {Navigation} from 'react-router';
// import CreateSprint from './createSprint.jsx';
// import {mockProjects} from '../../../tests/utils/fake.js';
import {ProjectActions} from '../../actions/actions';
import ProjectStore from '../../stores/projectStore';

import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';

import CurrentSprintInfo from './currentSprintInfo.jsx';
import NextSprintInfo from './nextSprintInfo.jsx';
import Droparea from './droparea.jsx';
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
        sprints: [],
        tasks: []
      },
      currentSprint: {},
      nextSprint: {},
      tasksInCurrentSprint : [],
      tasksForNextSprint: [],
      tasksInBacklog: []
    };
  },

  componentDidMount() {
    this.listenTo(ProjectStore, this.onStoreUpdate);
    ProjectActions.fetchProject(this.state.id);
  },

  onStoreUpdate(project) {
    // we may also want to keep track of 'done tasks'; not doing it at the moment
    console.log('in component - hear that store updated');
    let currentSprint = _.findWhere(project.sprints, {status: 'In Progress'});
    let nextSprint = _.findWhere(project.sprints, {status: 'Not Started'});
    let tasksInCurrentSprint;
    if (currentSprint) {
      tasksInCurrentSprint = _.where(project.tasks, {sprintId: currentSprint.id});
    }
    // let tasksForNextSprint = _.where(project.tasks, {sprintId: nextSprint.id});
    let tasksInBacklog = _.where(project.tasks, {sprintId: null});
    this.setState({
      project: project,
      currentSprint: currentSprint,
      nextSprint: nextSprint,
      tasksInCurrentSprint : tasksInCurrentSprint,
      // tasksForNextSprint: tasksForNextSprint,
      tasksInBacklog: tasksInBacklog
    });
  },

  render() {
    let sprint = () => {
      if (this.state.currentSprint) {
        return (
          <CurrentSprintInfo
            sprint={this.state.currentSprint}
            tasks={this.state.tasksInCurrentSprint} />
        );
      }
      return (
        <NextSprintInfo
          project={this.state.id}
          sprint={this.state.nextSprint}
          tasks={this.state.tasksForNextSprint} />
      );
    };

    return (
      <div className='project-view'>
        {sprint()}
        <Droparea tasks={this.state.tasksForNextSprint} />
        <hr />
        <Backlog
          projectId={this.state.id}
          users={this.state.project.users}
          tasks={this.state.tasksInBacklog}
        />
      </div>
    );
  }
});

export default DragDropContext(HTML5Backend)(Project);
