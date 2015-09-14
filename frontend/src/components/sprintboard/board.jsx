import _ from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import {SprintActions} from '../../actions/actions';
import SprintStore from '../../stores/sprintStore';

import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';

import SprintColumn from './column.jsx';
import CreateTask from '../tasks/createTask.jsx';

let SprintBoard = React.createClass({
  mixins: [Reflux.ListenerMixin],

  getInitialState() {
    return {
      id: parseInt(this.props.params.id),
      users: [],
      sprint: {
        columns: [],
        tasksByColumn: []
      },
      showModal: false
    };
  },

  componentDidMount() {
    this.listenTo(SprintStore, this.onStoreUpdate);
    SprintActions.fetchSprint(this.state.id);
  },

  onStoreUpdate(data) {
    this.setState(data);
  },

  close() {
    this.setState({showModal: false});
    SprintActions.fetchSprint(this.state.id);
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
        <CreateTask
          showModal={this.state.showModal}
          project={this.state.id}
          close={this.close}
          users={this.state.users}
          sprint={this.state.sprint.id}
        />
        {sprintColumns}
      </div>
    );
  }

});

export default DragDropContext(HTML5Backend)(SprintBoard);
