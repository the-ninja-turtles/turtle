import Reflux from 'reflux';
import axios from 'axios';
import {DashboardActions as Actions} from '../actions/actions';

axios.interceptors.request.use((config) => {
  config.headers.Authorization = 'Bearer ' + localStorage.getItem('userToken');
  config.url = 'http://127.0.0.1:1337'; // project service
  return config;
});

let count = 3;
let mock = [
  {
    id: 1,
    name: 'Greenfield'
  }, {
    id: 2,
    name: 'Legacy'
  }
];

let DashboardStore = Reflux.createStore({
  init() {
    this.listenTo(Actions.fetchProjects, this.onFetchProjects);
    this.listenTo(Actions.createProject, this.onCreateProject);
  },
  onFetchProjects() {
    // axios.get('/projects')
    //   .then((response) => {
    //     if (response.status === 200) {
    //       this.trigger(response.data);
    //     }
    //   });

    // delete when ready
    this.trigger(mock);
  },
  onCreateProject() {
    // axios.post('/projects', {
    //   name: 'my project'
    // })
    // .then((response) => {
    //   if (response.status === 201) {
    //     Actions.fetchProjects();
    //   }
    // });

    // delete when ready
    mock.push({
      id: count++,
      name: 'Thesis'
    });

    Actions.fetchProjects();
  }
});

export default DashboardStore;
