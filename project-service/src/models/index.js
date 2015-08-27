import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import configs from '../../config.js';

let env = process.env.NODE_ENV || 'development';
let config = configs[env];

let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

let db = {};

// import each model from file into sequelize orm
fs.readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach((file) => {
    // imported models are cached, these files will only be imported once
    let model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

// set up associations between models (belongsTo, hasMany, etc)
for (let modelName in db) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
