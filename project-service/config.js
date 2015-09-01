let config = {
  development: {
    host: '127.0.0.1',
    dialect: 'postgres',
    database: 'turtle',
    username: 'test',
    password: ''
  },
  test: {
    host: '127.0.0.1',
    dialect: 'sqlite',
    database: 'memory',
    username: '',
    password: '',
    storage: ':memory:',
    logging: false
  },
  production: {
    host: process.env.HOST,
    dialect: 'postgres',
    database: process.env.DB,
    username: process.env.USERNAME,
    password: process.env.PASSWORD
  }
};

export default config;
