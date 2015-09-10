import _ from 'lodash';
import axios from 'axios';
import auth from '../auth/auth.js';

export let origin = _.memoize((sub, port) => {
  let domain = window.location.hostname;
  if (domain !== 'localhost') {
    domain = sub + '.' + domain;
  } else {
    domain = domain + ':' + port;
  }
  return window.location.protocol + '//' + domain;
});

export let request = (method, url, data) => {
  let options = {
    method: method,
    url: url
  };
  if (method === 'PUT' || method === 'POST') {
    options.data = JSON.stringify(data),
    options.headers = {'Content-Type': 'application/json'};
  }
  return axios(options).then((res) => {
    return res.data;
  }).catch((res) => {
    return new Promise((resolve, reject) => {
      console.error({code: res.status, error: res.data.error});
      reject({code: res.status, error: res.data.error});
    });
  });
};

axios.interceptors.request.use((config) => {
  return auth().token().then((token) => {
    config.headers.Authorization = 'Bearer ' + token;
    config.url = origin('api', 3000) + config.url;
    return config;
  });
});
