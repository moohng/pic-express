const { Model, DataTypes } = require('sequelize');

// 定义数据模型
class Counter extends Model {}

exports.initCounter = async function (sequelize) {
  Counter.init(
    {
      count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    { sequelize, modelName: 'Counter' }
  );

  await Counter.sync({ alter: true });
};
