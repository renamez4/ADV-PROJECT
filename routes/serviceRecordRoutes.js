const express = require('express');
const router = express.Router();
const db = require('../models');

// ---------------------------------------------------------
// ไฟล์นี้คือส่วนที่สำคัญที่สุด: ระบบบันทึกการซ่อม (Many-to-Many)
// ---------------------------------------------------------

// 1. หน้าประวัติการซ่อมทั้งหมด
router.get('/', async (req, res) => {
    try {
        // ดึงข้อมูลการซ่อมรถ พร้อมข้อมูลรถ และข้อมูลช่าง มาแสดงผล
        const records = await db.ServiceRecord.findAll({
            include: [db.Car, db.Mechanic]
        });
        res.render('service-records/index', { records });
    } catch (error) {
        res.redirect('/');
    }
});

// 2. หน้าฟอร์มเปิดใบแจ้งซ่อมใหม่
router.get('/new', async (req, res) => {
    try {
        // ต้องไปดึงข้อมูล "รถ", "ช่าง", และ "รายการบริการ" มาให้เลือกในฟอร์ม
        const cars = await db.Car.findAll();
        const mechanics = await db.Mechanic.findAll();
        const items = await db.ServiceItem.findAll();
        res.render('service-records/create', { cars, mechanics, items });
    } catch (error) {
        res.redirect('/service-records');
    }
});

// 3. ระบบบันทึกการซ่อม และคำนวณเงิน (หัวใจของระบบ)
router.post('/', async (req, res) => {
    // ใช้ Transaction เพื่อให้แน่ใจว่าถ้าบันทึกตารางหนึ่งพลาด อีกตารางจะไม่บันทึก (ป้องกันข้อมูลขยะ)
    const t = await db.sequelize.transaction();
    try {
        const { carId, mechanicId, serviceDate, description, serviceItems } = req.body;

        let totalCost = 0;
        // ตรวจสอบว่าเลือกรายการบริการมากี่อย่าง (ถ้าเลือกแค่อย่างเดียวต้องทำเป็น Array ก่อน)
        const itemsToItems = Array.isArray(serviceItems) ? serviceItems : [serviceItems];

        // ไปดึงราคาของของแต่ละรายการที่เราติ๊กเลือกมาจากฐานข้อมูล
        const dbItems = await db.ServiceItem.findAll({
            where: { id: itemsToItems }
        });

        // เอาค่าบริการแต่ละอันมาบวกกันเป็นราคารวม
        dbItems.forEach(item => {
            totalCost += parseFloat(item.price);
        });

        // ขั้นตอนที่ ก: บันทึกข้อมูลการซ่อมหลักลงในตาราง ServiceRecord
        const record = await db.ServiceRecord.create({
            carId,
            mechanicId,
            serviceDate,
            description,
            totalCost
        }, { transaction: t });

        // ขั้นตอนที่ ข: บันทึกรายการย่อย (Many-to-Many) ลงในตาราง ServiceDetail
        const details = dbItems.map(item => ({
            serviceRecordId: record.id,
            serviceItemId: item.id,
            unitPrice: item.price
        }));

        // บันทึกรายการย่อยหลายรายการพร้อมกัน
        await db.ServiceDetail.bulkCreate(details, { transaction: t });

        // ยืนยันการบันทึกลงฐานข้อมูลจริง
        await t.commit();
        req.flash('success', 'เปิดใบแจ้งซ่อมและคำนวณเงินเรียบร้อยแล้ว');
        res.redirect('/service-records');
    } catch (error) {
        // ถ้ามีอะไรผิดพลาด ให้ยกเลิกการบันทึกทั้งหมด
        await t.rollback();
        console.error(error);
        res.redirect('/service-records/new');
    }
});

// 4. ดูใบเสร็จ / รายละเอียดการซ่อมฉบับเต็ม
router.get('/:id', async (req, res) => {
    try {
        // ดึงข้อมูลการซ่อมที่ต้องการออกมา พร้อมข้อมูลที่เกี่ยวข้องทั้งหมด
        const record = await db.ServiceRecord.findByPk(req.params.id, {
            include: [
                db.Car,
                db.Mechanic,
                { model: db.ServiceItem, through: db.ServiceDetail } // ดึงรายการบริการย่อย (Many-to-Many) ออกมาด้วย
            ]
        });
        res.render('service-records/show', { record });
    } catch (error) {
        res.redirect('/service-records');
    }
});

module.exports = router;
