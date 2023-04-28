const { Model, DataTypes } = require('sequelize');

// 定义数据模型
class MediaCheckResult extends Model {}

async function initMediaCheckResult(sequelize) {
  MediaCheckResult.init(
    {
      trace_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      result: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
    },
    { sequelize, modelName: 'MediaCheckResult' }
  );

  await MediaCheckResult.sync({ alter: true });
};

module.exports = {
  MediaCheckResult,
  initMediaCheckResult,
}
