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

// 4. ระบบลบข้อมูลช่าง
router.delete('/:id', async (req, res) => {
    await db.Mechanic.destroy({ where: { id: req.params.id } });
    res.redirect('/mechanics');
});

module.exports = router;
