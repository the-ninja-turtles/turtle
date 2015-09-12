import _ from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import {Navigation} from 'react-router';
import {ProgressBar} from 'react-bootstrap';

let CurrentSprint = React.createClass({

  mixins: [Navigation, Reflux.ListenerMixin],

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

  endSprint() {

  },

  render() {
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
          <button className='btn primary' onClick={this.openSprintboard}>Open sprintboard</button>
          <button className='btn danger' onClick={this.endSprint()}>End sprint</button>
        </div>
        <div className='clearfix'></div>
        <ProgressBar />
      </div>
    );
  }

});

export default CurrentSprint;
