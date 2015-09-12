import request from 'request-promise';

export default (event, acl, data) => {
  let url = 'http://' + process.env.EVENTSYSTEM_PORT_90_TCP_ADDR + ':90/publish/projects';
  return request
    .post({
      url: url,
      json: true,
      body: {
        event: event,
        acl: acl,
        data: data
      }
    })
    .catch((res) => {
      console.error(res.message);
    });
};
