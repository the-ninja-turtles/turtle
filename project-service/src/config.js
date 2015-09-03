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
    host: process.env.POSTGRES_PORT_5432_TCP_ADDR,
    dialect: 'postgres',
    database: 'postgres',
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
  }
};

export default config;
