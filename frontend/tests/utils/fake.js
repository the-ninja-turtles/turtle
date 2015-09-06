import _ from 'lodash';
import {projects, sprints, tasks} from '../../../tests/fixtures.js';

export let mock = (arr, n) => {
  return _.map(new Array(n), (e, i) => {
    let r = Math.floor(Math.random() * arr.length);
    let el = _.clone(arr[r]);
    el.id = i;
    return el;
  });
};

export let mockTasks = mock.bind(null, tasks);

export let mockSprints = (n, t) => {
  return _.map(mock(sprints, n), (sprint) => {
    sprint.tasks = mockTasks(t);
    return sprint;
  });
};

export let mockProjects = (n, s, t) => {
  return _.map(mock(projects, n), (project) => {
    project.sprints = mockSprints(s, t);
    project.tasks = mockTasks(t);
    return project;
  });
};
