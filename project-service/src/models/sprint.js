export default (sequelize, DataTypes) => {
  let Sprint = sequelize.define('Sprint', {
    name: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING
    },
    startDate: {
      type: DataTypes.DATE
    },
    endDate: {
      type: DataTypes.DATE
    }
  }, {
    classMethods: {
      associate: (models) => {
        Sprint.belongsTo(models.Project, {
          as: 'project',
          foreignKey: 'projectId'
        });
        Sprint.hasMany(models.Task, {
          as: 'tasks',
          foreignKey: 'sprintId'
        });
      }
    }
  });

  return Sprint;
};
