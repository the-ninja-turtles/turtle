export default (sequelize, DataTypes) => {
  let Sprint = sequelize.define('Sprint', {
    name: {
      type: DataTypes.STRING,
      defaultValue: '',
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        isIn: [[0, 1, 2]]
      }
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
