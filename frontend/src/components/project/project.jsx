import React from 'react';
import Backlog from './backlog.jsx';
import CreateSprint from './createSprint.jsx';
import {mockProjects} from '../../../tests/utils/fake.js';

let Project = React.createClass({

  getInitialState() {
    return {
      project: mockProjects(1, 2, 4)[0]
    };
  },

  componentDidMount() {
    let id = this.props.params.id;
    // conduct fetch for project details using this projectId
  },

  render() {
    let tasks = this.state.project.tasks;
    return (
      <div className='project-view'>
        <CreateSprint />
        <hr />
        <Backlog tasks={tasks} />
      </div>
    );
  }

});

export default Project;
