import _ from 'lodash';
import React from 'react';
import {Navigation} from 'react-router';
import {ProgressBar} from 'react-bootstrap';
import {ProjectActions} from '../../actions/actions.js';

let CurrentSprint = React.createClass({

  mixins: [Navigation],

  openSprintboard() {
    this.transitionTo('sprint', {id: this.props.project});
  },

  score() {
    return _.reduce(this.props.tasks, (acc, task) => {
      return acc + task.score;
    }, 0);
  },

  currScore() {
    return _.reduce(this.props.tasks, (acc, task) => {
      if (task.status !== 3) {
        return acc;
      }
      return acc + task.score;
    }, 0);
  },

  tasks() {
    return this.props.tasks && this.props.tasks.length || 0;
  },

  currTasks() {
    return _.reduce(this.props.tasks, (acc, task) => {
      if (task.status === 3) {
        return acc++;
      }
      return acc;
    }, 0);
  },

  days() {
    let start = Date.parse(this.props.sprint.startDate);
    let diff = Date.now() - start;
    return Math.floor(diff / (24 * 3600 * 1000));
  },

  endSprint() {
    ProjectActions.endSprint();
  },

  render() {
    let length = this.props.length;
    let current = this.days();
    let message = Math.abs(length - current) + ' days ' + (length > current ? 'left' : 'overdue');

    let max = () => {
      return Math.max(length, current);
    };
    let green = () => {
      return (length > current ? current : length) / max() * 100;
    };
    let red = () => {
      return (current > length ? current - length : 0) / max() * 100;
    };
    return (
      <div className='current-sprint-info'>
        <div className='info left'>
          <span className='sprint-score'>
            <span className='sprint-score-label'>Score</span>
            <span className='sprint-score-score'>{this.currScore()}/{this.score()}</span>
          </span>
          <span className='sprint-score'>
            <span className='sprint-score-label'>Tasks</span>
            <span className='sprint-score-score'>{this.currTasks()}/{this.tasks()}</span>
          </span>
        </div>
        <div className='btn-container right'>
          <button className='btn block primary' onClick={this.openSprintboard}>Open sprintboard</button>
          <button className='btn block danger' onClick={this.endSprint}>End sprint</button>
        </div>
        <div className='clearfix'></div>
        <span className='days-left'>{message}</span>
        <ProgressBar>
          <ProgressBar bsStyle='success' now={green()} />
          <ProgressBar bsStyle='danger' now={red()} />
        </ProgressBar>
      </div>
    );
  }

});

export default CurrentSprint;
