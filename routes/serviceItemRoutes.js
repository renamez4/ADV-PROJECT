const express = require('express');
const router = express.Router();
const db = require('../models');

// 1. ดูรายการบริการมาตรฐานทั้งหมด
router.get('/', async (req, res) => {
    const items = await db.ServiceItem.findAll();
    res.render('service-items/index', { items });
});

// 2. หน้าเพิ่มรายการบริการ
router.get('/new', (req, res) => {
    res.render('service-items/create');
});

// 3. ระบบบันทึกบริการใหม่
router.post('/', async (req, res) => {
    try {
        await db.ServiceItem.create(req.body);
        res.redirect('/service-items');
    } catch (error) {
        res.redirect('/service-items/new');
    }
});

// 4. ลบรายการบริการ
router.delete('/:id', async (req, res) => {
    await db.ServiceItem.destroy({ where: { id: req.params.id } });
    res.redirect('/service-items');
});

module.exports = router;
