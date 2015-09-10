import _ from 'lodash';
import React from 'react';
import Reflux from 'reflux';
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
    Reflux.ListenerMixin
  ],

  getInitialState() {
    return {
      project: {},
      currentSprint: {},
      nextSprint: {},
      tasksInCurrentSprint : [],
      tasksForNextSprint: [],
      tasksInBacklog: []
    };
  },

  componentDidMount() {
    this.listenTo(ProjectStore, this.onStoreUpdate);
    let id = this.props.params.id;
    ProjectActions.fetchProject(id);
  },

  onStoreUpdate(project) {
    // we may also want to keep track of 'done tasks'; not doing it at the moment
    let currentSprint = _.findWhere(project.sprints, {status: 'In Progress'});
    let nextSprint = _.findWhere(project.sprints, {status: 'Not Started'});
    let tasksInCurrentSprint;
    if (currentSprint) {
      tasksInCurrentSprint = _.where(project.tasks, {sprintId: currentSprint.id});
    }
    let tasksForNextSprint = _.where(project.tasks, {sprintId: nextSprint.id});
    let tasksInBacklog = _.where(project.tasks, {sprintId: null});
    this.setState({
      project: project,
      currentSprint: currentSprint,
      nextSprint: nextSprint,
      tasksInCurrentSprint : tasksInCurrentSprint,
      tasksForNextSprint: tasksForNextSprint,
      tasksInBacklog: tasksInBacklog
    });
  },

  render() {
    if (this.state.currentSprint) {
      return (
        <div className='project-view'>
          <CurrentSprintInfo
            sprint={this.state.currentSprint}
            tasks={this.state.tasksInCurrentSprint}
          />
          <Droparea tasks={this.state.tasksForNextSprint} />
          <hr />
          <Backlog tasks={this.state.tasksInBacklog} />
        </div>
      );
    } else {
      return (
        <div className='project-view'>
          <NextSprintInfo
            sprint={this.state.nextSprint}
            tasks={this.state.tasksForNextSprint}
          />
          <Droparea tasks={this.state.tasksForNextSprint} />
          <hr />
          <Backlog tasks={this.state.tasksInBacklog} />
        </div>
      );
    }
  }
});

export default DragDropContext(HTML5Backend)(Project);
