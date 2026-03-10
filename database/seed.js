const db = require('../models');

async function seed() {
    try {
        await db.sequelize.sync({ force: true });
        console.log('Database synced successfully.');


        const customers = await db.Customer.bulkCreate([
            { fullName: 'สมชาย รักรถ', phone: '0812345678', email: 'somchai@email.com' },
            { fullName: 'สมหญิง จริงใจ', phone: '0898765432', email: 'somying@email.com' }
        ]);


        const cars = await db.Car.bulkCreate([
            { plateNumber: 'กข 1234', brand: 'Toyota', model: 'Camry', customerId: customers[0].id },
            { plateNumber: 'ชญ 5678', brand: 'Honda', model: 'Civic', customerId: customers[0].id },
            { plateNumber: 'บบ 9999', brand: 'Mazda', model: 'Mazda 3', customerId: customers[1].id }
        ]);


        const mechanics = await db.Mechanic.bulkCreate([
            { mechanicName: 'ช่างเก่ง ดีเยี่ยม', skillLevel: 'Senior', phone: '0855555555' },
            { mechanicName: 'ช่างฟ้า รวดเร็ว', skillLevel: 'Intermediate', phone: '0844444444' }
        ]);


        const serviceItems = await db.ServiceItem.bulkCreate([
            { itemName: 'เปลี่ยนน้ำมันเครื่อง', price: 1500.00 },
            { itemName: 'เช็คระยะ 20,000 กม.', price: 2500.00 },
            { itemName: 'เปลี่ยนผ้าเบรค', price: 1800.00 },
            { itemName: 'ตั้งศูนย์ถ่วงล้อ', price: 800.00 }
        ]);


        const record1 = await db.ServiceRecord.create({
            serviceDate: new Date(),
            description: 'ตรวจเช็คระยะปกติ',
            carId: cars[0].id,
            mechanicId: mechanics[0].id,
            totalCost: 1500.00
        });
        await db.ServiceDetail.create({
            serviceRecordId: record1.id,
            serviceItemId: serviceItems[0].id,
            unitPrice: serviceItems[0].price
        });


        const record2 = await db.ServiceRecord.create({
            serviceDate: new Date(),
            description: 'เปลี่ยนเบรคและตั้งศูนย์',
            carId: cars[2].id,
            mechanicId: mechanics[1].id,
            totalCost: 2600.00
        });
        await db.ServiceDetail.bulkCreate([
            { serviceRecordId: record2.id, serviceItemId: serviceItems[2].id, unitPrice: serviceItems[2].price },
            { serviceRecordId: record2.id, serviceItemId: serviceItems[3].id, unitPrice: serviceItems[3].price }
        ]);

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
