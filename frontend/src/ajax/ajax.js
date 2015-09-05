import axios from 'axios';

export let origin = (port) => {
  return window.location.protocol + '//' + window.location.hostname + ':' + port;
};

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
  config.headers.Authorization = 'Bearer ' + localStorage.getItem('userToken');
  config.url = origin(3000) + config.url;
  return config;
});
