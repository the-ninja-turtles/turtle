import {mockSprints} from '../../../tests/utils/fake.js';
import React from 'react/addons';
// import Reflux from 'reflux';
// import Actions from '../../actions/actions';

import SprintColumn from './column.jsx';

let sprint = mockSprints(1, 3)[0];

let SprintBoard = React.createClass({
  // mixins: [
  //   Reflux.listenTo(HelloStore, 'onStoreUpdate')
  // ],

  getInitialState() {
    return {
      sprint: sprint,
      sprintColumns: ['Backlog', 'Ready', 'In Progress', 'Done']
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
      <div className='sprintBoard'>
        {sprintColumns}
      </div>
    );
  }

});

export default SprintBoard;
