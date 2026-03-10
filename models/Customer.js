module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Customer', {
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        }
    });
};
