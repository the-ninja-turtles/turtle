export default (sequelize, DataTypes) => {
  let User = sequelize.define('User', {
    auth0Id: { // unique id (user_id from decoded JWT) provided by Auth0
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email: { // email from decoded JWT provided by Auth0
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    username: { // nickname from Auth0
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    picture: { // picture url from Auth0
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: (models) => {
        User.belongsToMany(models.Project, {
          as: 'projects',
          through: 'UserProject',
          foreignKey: 'userId'
        });
        User.hasMany(models.Task, {
          as: 'tasks',
          foreignKey: 'userId'
        });
      }
    }
  });

  return User;
};
