import _ from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import {SprintActions} from '../../actions/actions';
import SprintStore from '../../stores/sprintStore';

import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';

import SprintColumn from './column.jsx';

let SprintBoard = React.createClass({
  mixins: [
    Reflux.ListenerMixin
  ],

  getInitialState() {
    return {
      sprint: {
        columns: [],
        tasksByColumn: {}
      }
    };
  },

  componentDidMount() {
    this.listenTo(SprintStore, this.onStoreUpdate);
    SprintActions.fetchSprint();
  },

  onStoreUpdate(sprint) {
    this.setState({
      sprint: sprint
    });
  },

  render() {
    let sprintColumns = [];
    _.forEach(this.state.sprint.columns, (column, key) => {
      let columnTasks = this.state.sprint.tasksByColumn[key];
      sprintColumns.push(
        <SprintColumn
          key={column}
          id={key}
          columnName={column}
          tasks={columnTasks}
        />
      );
    });

    return (
      <div className='sprint-board'>
        {sprintColumns}
      </div>
    );
  }

});

export default DragDropContext(HTML5Backend)(SprintBoard);
