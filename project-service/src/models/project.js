export default (sequelize, DataTypes) => {
  let Project = sequelize.define('Project', {
    name: {
      type: DataTypes.STRING(40),
      validate: {
        notEmpty: true
      }
    },
    length: {
      type: DataTypes.INTEGER,
      defaultValue: 7,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    columns: {
      type: DataTypes.INTEGER,
      defaultValue: 4,
      allowNull: false,
      validate: {
        min: 4
      }
    }
  }, {
    classMethods: {
      associate: (models) => {
        Project.belongsToMany(models.User, {
          as: 'users',
          through: 'UserProject',
          foreignKey: 'projectId'
        });
        Project.hasMany(models.Sprint, {
          as: 'sprints',
          foreignKey: 'projectId',
          onDelete: 'CASCADE' // also delete sprints that belong to this project
        });
        Project.hasMany(models.Task, {
          as: 'tasks',
          foreignKey: 'projectId',
          onDelete: 'CASCADE' // also delete tasks that belong to this projet
        });
      }
    }
  });

  return Project;
};
