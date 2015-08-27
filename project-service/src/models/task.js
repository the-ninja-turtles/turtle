export default (sequelize, DataTypes) => {
  let Task = sequelize.define('Task', {
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING
    },
    score: {
      type: DataTypes.INTEGER
    },
    rank: {
      type: DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate: (models) => {
        Task.belongsTo(models.Project, {
          as: 'project',
          foreignKey: 'projectId'
        });
        Task.belongsTo(models.Sprint, {
          as: 'sprint',
          foreignKey: 'sprintId'
        });
        Task.belongsTo(models.User, {
          as: 'user',
          foreignKey: 'userId'
        });
      }
    }
  });

  return Task;
};
