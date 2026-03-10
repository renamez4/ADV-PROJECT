module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Mechanic', {
        mechanicName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        skillLevel: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};
