import sprintColumns from '../../mock-data/sprint-columns';
import mockSprintData from '../../mock-data/mock-sprint';

import React from 'react/addons';
// import Reflux from 'reflux';
// import Actions from '../../actions/actions';

import SprintColumn from './column.jsx';

let SprintBoard = React.createClass({
  // mixins: [
  //   Reflux.listenTo(HelloStore, 'onStoreUpdate')
  // ],

  getInitialState() {
    return {
      sprint: mockSprintData,
      sprintColumns: sprintColumns
    };
  },

  // onStoreUpdate(addressee) {
  //   this.setState({
  //     addressee: addressee
  //   });
  // },

  // magicFunction() {
  //   Actions.addresseeUpdate();
  // },

  render() {
    let sprintColumns = this.state.sprintColumns.map((column) => {
      return (
        <SprintColumn
          columnName={column}
          tasks={this.state.sprint.tasks}
        />
      );
    });

    return (
      <div className="sprintBoard">
        {sprintColumns}
      </div>
    );
  }

});

export default SprintBoard;
