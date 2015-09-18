import _ from 'lodash';
import React from 'react';
import {ProgressBar} from 'react-bootstrap';

let SprintStats = React.createClass({
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

  render() {
    let length = this.props.length * 24 * 3600 * 1000;
    let current = Date.now() - Date.parse(this.props.sprint.startDate);
    let displayText = () => {
      let difference = Math.abs(length - current);
      let days = Math.floor(difference/1000/3600/24);
      let hours = Math.floor(difference/1000/3600) - days * 24;
      return `${days} day${days === 1 ? '' : 's'}, ${hours} hour${hours === 1 ? '' : 's'} ${length > current ? 'remaining' : 'overdue'}`;
    };

    let remaining = () => {
      return Math.max(0, length - current)/length * 100;
    };

    let overdue = () => {
      return !!(current > length) * 100; // show entire bar red
    };

    return (
      <div className='current-sprint-info'>
        <span className='info'>
          <span className='info-block third text-left days-left'><strong>Current Sprint Information</strong></span>
          <span className='info-block third text-center'>
            <span className='info-block-label'>Score: </span>
            <span className='info-block-value'>{this.currScore()}/{this.score()}</span>
          </span>
          <span className='info-block third text-right'>
            <span className='info-block-label'>Completed Tasks: </span>
            <span className='info-block-score'>{this.currTasks()}/{this.tasks()}</span>
          </span>
        </span>
        <ProgressBar>
          <ProgressBar key={0} bsStyle='success' now={remaining()} label={displayText()} />
          <ProgressBar key={1} bsStyle='danger' now={overdue()} label={displayText()} />
        </ProgressBar>
      </div>
    );
  }
});

export default SprintStats;
