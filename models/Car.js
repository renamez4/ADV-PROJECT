module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Car', {
        plateNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        brand: {
            type: DataTypes.STRING,
            allowNull: false
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};
