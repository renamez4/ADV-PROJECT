module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ServiceItem', {
        itemName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        }
    });
};
