const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_PATH || './database/database.sqlite',
  logging: false
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import Models
db.Customer = require('./Customer')(sequelize, Sequelize);
db.Car = require('./Car')(sequelize, Sequelize);
db.Mechanic = require('./Mechanic')(sequelize, Sequelize);
db.ServiceItem = require('./ServiceItem')(sequelize, Sequelize);
db.ServiceRecord = require('./ServiceRecord')(sequelize, Sequelize);
db.ServiceDetail = require('./ServiceDetail')(sequelize, Sequelize);

// Set up Associations
// Customers (1) <-> Cars (M)
db.Customer.hasMany(db.Car, { foreignKey: 'customerId', onDelete: 'CASCADE' });
db.Car.belongsTo(db.Customer, { foreignKey: 'customerId' });

// Cars (1) <-> ServiceRecords (M)
db.Car.hasMany(db.ServiceRecord, { foreignKey: 'carId', onDelete: 'CASCADE' });
db.ServiceRecord.belongsTo(db.Car, { foreignKey: 'carId' });

// Mechanics (1) <-> ServiceRecords (M)
db.Mechanic.hasMany(db.ServiceRecord, { foreignKey: 'mechanicId' });
db.ServiceRecord.belongsTo(db.Mechanic, { foreignKey: 'mechanicId' });

// ServiceRecords (M) <-> ServiceItems (M) via ServiceDetails (Junction Table)
db.ServiceRecord.belongsToMany(db.ServiceItem, { 
  through: db.ServiceDetail, 
  foreignKey: 'serviceRecordId' 
});
db.ServiceItem.belongsToMany(db.ServiceRecord, { 
  through: db.ServiceDetail, 
  foreignKey: 'serviceItemId' 
});

// Explicit associations for the junction table if needed
db.ServiceRecord.hasMany(db.ServiceDetail, { foreignKey: 'serviceRecordId' });
db.ServiceDetail.belongsTo(db.ServiceRecord, { foreignKey: 'serviceRecordId' });
db.ServiceItem.hasMany(db.ServiceDetail, { foreignKey: 'serviceItemId' });
db.ServiceDetail.belongsTo(db.ServiceItem, { foreignKey: 'serviceItemId' });

module.exports = db;
