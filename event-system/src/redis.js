import redis from 'then-redis';

let createClient = () => {
  return redis.createClient(process.env.REDIS_PORT_6379_TCP);
};

export default {createClient: createClient};
