module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ServiceRecord', {
        serviceDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        description: {
            type: DataTypes.TEXT
        },
        totalCost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        }
    });
};
