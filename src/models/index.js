const User = require("./User");
const ApiLog = require("./ApiLog");

// Define model associations
// ApiLog belongs to User (each log entry has a userId)
ApiLog.belongsTo(User, { foreignKey: "userId" });
User.hasMany(ApiLog, { foreignKey: "userId" });

module.exports = {
    User,
    ApiLog,
};
