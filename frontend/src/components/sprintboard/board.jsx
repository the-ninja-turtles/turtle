import _ from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import {SprintActions, ProjectActions} from '../../actions/actions';
import ProjectStore from '../../stores/projectStore';
import SprintStore from '../../stores/sprintStore';

import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';

import SprintColumn from './column.jsx';
import TaskForm from '../tasks/taskForm.jsx';

let SprintBoard = React.createClass({
  mixins: [Reflux.ListenerMixin],

  getInitialState() {
    return {
      id: parseInt(this.props.params.id),
      users: [],
      sprint: {
        columns: [],
        tasksByColumn: []
      }
    };
  },

  componentDidMount() {
    this.listenTo(ProjectStore, this.onProjectStoreUpdate);
    this.listenTo(SprintStore, this.onSprintStoreUpdate);
    ProjectActions.fetchProject(this.state.id);
  },

  onProjectStoreUpdate(data) {
    SprintActions.loadSprint(data);
  },

  onSprintStoreUpdate(data) {
    this.setState(data);
  },

  render() {
    let sprintColumns = _.map(this.state.sprint.columns, (column, key) => {
      let columnTasks = this.state.sprint.tasksByColumn[key];
      return (
        <SprintColumn
          key={column}
          id={key}
          columnName={column}
          tasks={columnTasks}
          users={this.state.users}
        />
      );
    });

    return (
      <div className='sprint-board'>
        <TaskForm
          project={this.state.id}
          users={this.state.users}
          sprint={this.state.sprint.id}
        />
        {sprintColumns}
      </div>
    );
  }

});

export default DragDropContext(HTML5Backend)(SprintBoard);
