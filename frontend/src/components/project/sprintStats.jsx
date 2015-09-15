import _ from 'lodash';
import React from 'react';
import {Navigation} from 'react-router';
import {ProgressBar} from 'react-bootstrap';
import {ProjectActions} from '../../actions/actions.js';

let SprintStats = React.createClass({

  mixins: [Navigation],

  openSprintboard() {
    this.transitionTo('sprint', {id: this.props.project});
  },

  score() {
    return _.reduce(this.props.sprint.tasks, (acc, task) => {
      return acc + task.score;
    }, 0);
  },

  currScore() {
    return _.reduce(this.props.sprint.tasks, (acc, task) => {
      if (task.status !== 3) {
        return acc;
      }
      return acc + task.score;
    }, 0);
  },

  tasks() {
    return this.props.sprint.tasks && this.props.sprint.tasks.length || 0;
  },

  currTasks() {
    return _.reduce(this.props.sprint.tasks, (acc, task) => {
      if (task.status === 3) {
        return acc + 1;
      }
      return acc;
    }, 0);
  },

  timeSinceStart() {
    let start = Date.parse(this.props.sprint.startDate);
    return Date.now() - start;
  },

  endSprint() {
    ProjectActions.endSprint();
  },

  render() {
    let length = this.props.length * 24 * 3600 * 1000;
    let current = this.timeSinceStart();
    let days = Math.floor(current / (24 * 3600 * 1000));
    let message = Math.abs(this.props.length - days) + ' days ' + (this.props.length > days ? 'left' : 'overdue');

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
        <span className='info'>
          <span className='info-block one-third text-left days-left'>{message}</span>
          <span className='info-block one-third text-center'>
            <span className='info-block-label'>Score</span>
            <span className='info-block-value'>{this.currScore()}/{this.score()}</span>
          </span>
          <span className='info-block one-third text-right'>
            <span className='info-block-label'>Tasks</span>
            <span className='info-block-score'>{this.currTasks()}/{this.tasks()}</span>
          </span>
        </span>
        <ProgressBar>
          <ProgressBar bsStyle='success' now={green()} />
          <ProgressBar bsStyle='danger' now={red()} />
        </ProgressBar>
      </div>
    );
  }

});

export default SprintStats;
