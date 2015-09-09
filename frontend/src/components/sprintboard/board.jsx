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
      sprint: {},
      sprintColumns: ['To Do', 'In Progress', 'Review', 'Done']
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
    let sprintColumns = this.state.sprintColumns.map((column) => {
      let columnTasks = _.where(this.state.sprint.tasks, {status: column});
      return (
        <SprintColumn
          key={column}
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
