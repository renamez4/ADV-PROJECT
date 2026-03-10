const express = require('express');
const router = express.Router();
const db = require('../models'); // ดึงฐานข้อมูลมาใช้งาน

// 1. หน้าแสดงรายชื่อลูกค้าทั้งหมด (GET /customers)
router.get('/', async (req, res) => {
    try {
        // ดึงข้อมูลลูกค้าทุกคนจากฐานข้อมูล
        const customers = await db.Customer.findAll();
        // ส่งข้อมูลไปแสดงผลที่หน้าจอ index.ejs
        res.render('customers/index', { customers });
    } catch (error) {
        res.redirect('/');
    }
});

// 2. หน้าฟอร์มสำหรับเพิ่มลูกค้าใหม่ (GET /customers/new)
router.get('/new', (req, res) => {
    res.render('customers/create');
});

// 3. ระบบบันทึกข้อมูลลูกค้าใหม่ (POST /customers)
router.post('/', async (req, res) => {
    try {
        // รับค่าจากฟอร์ม (req.body) มาบันทึกลงฐานข้อมูล
        await db.Customer.create(req.body);
        // แสดงข้อความแจ้งเตือนสีเขียวเมื่อสำเร็จ
        req.flash('success', 'บันทึกข้อมูลลูกค้าเรียบร้อยแล้ว');
        // เด้งกลับไปหน้าหลักของลูกค้า
        res.redirect('/customers');
    } catch (error) {
        req.flash('error', 'เกิดข้อผิดพลาดในการบันทึก');
        res.redirect('/customers/new');
    }
});

// 4. หน้าฟอร์มสำหรับแก้ไขข้อมูลลูกค้า (GET /customers/:id/edit)
router.get('/:id/edit', async (req, res) => {
    try {
        // หาข้อมูลลูกค้าตาม id ที่ส่งมา
        const customer = await db.Customer.findByPk(req.params.id);
        res.render('customers/edit', { customer });
    } catch (error) {
        res.redirect('/customers');
    }
});

// 5. ระบบอัปเดตข้อมูลลูกค้า (PUT /customers/:id)
router.put('/:id', async (req, res) => {
    try {
        // อัปเดตข้อมูลในฐานข้อมูลตาม id
        await db.Customer.update(req.body, { where: { id: req.params.id } });
        req.flash('success', 'แก้ไขข้อมูลเรียบร้อยแล้ว');
        res.redirect('/customers');
    } catch (error) {
        res.redirect('/customers');
    }
});

// 6. ระบบลบข้อมูลลูกค้า (DELETE /customers/:id)
router.delete('/:id', async (req, res) => {
    try {
        await db.Customer.destroy({ where: { id: req.params.id } });
        req.flash('success', 'ลบข้อมูลเรียบร้อยแล้ว');
        res.redirect('/customers');
    } catch (error) {
        res.redirect('/customers');
    }
});

module.exports = router;
