const express = require('express');
const router = express.Router();
const db = require('../models');

// 1. หน้าแสดงรายชื่อช่าง
router.get('/', async (req, res) => {
    const mechanics = await db.Mechanic.findAll();
    res.render('mechanics/index', { mechanics });
});

// 2. หน้าเพิ่มช่างใหม่
router.get('/new', (req, res) => {
    res.render('mechanics/create');
});

// 3. ระบบบันทึกช่างใหม่
router.post('/', async (req, res) => {
    try {
        await db.Mechanic.create(req.body);
        req.flash('success', 'เพิ่มช่างซ่อมคนใหม่แล้ว');
        res.redirect('/mechanics');
    } catch (error) {
        res.redirect('/mechanics/new');
    }
});

// 4. หน้าแก้ไขข้อมูลช่างเดิม
router.get('/:id/edit', async (req, res) => {
    try {
        const mechanic = await db.Mechanic.findByPk(req.params.id);
        if (!mechanic) {
            req.flash('error', 'ไม่พบข้อมูลช่าง');
            return res.redirect('/mechanics');
        }
        res.render('mechanics/edit', { mechanic });
    } catch (error) {
        console.error(error);
        res.redirect('/mechanics');
    }
});

// 5. ระบบบันทึกการแก้ไขข้อมูลช่าง
router.put('/:id', async (req, res) => {
    try {
        await db.Mechanic.update(req.body, { where: { id: req.params.id } });
        req.flash('success', 'แก้ไขข้อมูลช่างเรียบร้อยแล้ว');
        res.redirect('/mechanics');
    } catch (error) {
        console.error(error);
        req.flash('error', 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
        res.redirect(`/mechanics/${req.params.id}/edit`);
    }
});

// 6. ระบบลบข้อมูลช่าง
router.delete('/:id', async (req, res) => {
    try {
        await db.Mechanic.destroy({ where: { id: req.params.id } });
        req.flash('success', 'ลบข้อมูลช่างเรียบร้อยแล้ว');
        res.redirect('/mechanics');
    } catch (error) {
        console.error(error);
        res.redirect('/mechanics');
    }
});

module.exports = router;
