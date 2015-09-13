export default (sequelize, DataTypes) => {
  let Task = sequelize.define('Task', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
      validate: {
        min: 1,
        max: 999
      }
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
      validate: {
        min: 1
      }
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
