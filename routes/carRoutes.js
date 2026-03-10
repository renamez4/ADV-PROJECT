const express = require('express');
const router = express.Router();
const db = require('../models');

// 1. หน้าแสดงรายชื่อรถยนต์ทั้งหมด
router.get('/', async (req, res) => {
    try {
        // ดึงข้อมูรถยนต์ พร้อมกับดึงชื่อเจ้าของรถ (Customer) มาโชว์ด้วย
        const cars = await db.Car.findAll({ include: [db.Customer] });
        res.render('cars/index', { cars });
    } catch (error) {
        res.redirect('/');
    }
});

// 2. หน้าฟอร์มเพิ่มรถใหม่
router.get('/new', async (req, res) => {
    // ต้องดึงรายชื่อลูกค้ามาให้เลือกใน Dropdown ด้วย
    const customers = await db.Customer.findAll();
    res.render('cars/create', { customers });
});

// 3. ระบบบันทึกรถใหม่
router.post('/', async (req, res) => {
    try {
        await db.Car.create(req.body);
        req.flash('success', 'บันทึกข้อมูลรถเรียบร้อยแล้ว');
        res.redirect('/cars');
    } catch (error) {
        res.redirect('/cars/new');
    }
});

// 4. หน้าแก้ไขข้อมูลรถ
router.get('/:id/edit', async (req, res) => {
    const car = await db.Car.findByPk(req.params.id);
    const customers = await db.Customer.findAll();
    res.render('cars/edit', { car, customers });
});

// 5. ระบบอัปเดตข้อมูลรถ
router.put('/:id', async (req, res) => {
    try {
        await db.Car.update(req.body, { where: { id: req.params.id } });
        req.flash('success', 'แก้ไขข้อมูลรถเรียบร้อยแล้ว');
        res.redirect('/cars');
    } catch (error) {
        console.error(error);
        req.flash('error', 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลรถ');
        res.redirect(`/cars/${req.params.id}/edit`);
    }
});

// 6. ระบบลบข้อมูลรถ
router.delete('/:id', async (req, res) => {
    try {
        await db.Car.destroy({ where: { id: req.params.id } });
        req.flash('success', 'ลบข้อมูลรถเรียบร้อยแล้ว');
        res.redirect('/cars');
    } catch (error) {
        console.error(error);
        req.flash('error', 'ไม่สามารถลบข้อมูลรถได้');
        res.redirect('/cars');
    }
});

module.exports = router;
