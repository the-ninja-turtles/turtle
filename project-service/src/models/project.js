export default (sequelize, DataTypes) => {
  let Project = sequelize.define('Project', {
    name: {
      type: DataTypes.STRING
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
