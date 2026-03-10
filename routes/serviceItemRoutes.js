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

// 4. หน้าแก้ไขรายการบริการ
router.get('/:id/edit', async (req, res) => {
    try {
        const item = await db.ServiceItem.findByPk(req.params.id);
        res.render('service-items/edit', { item });
    } catch (error) {
        res.redirect('/service-items');
    }
});

// 5. ระบบบันทึกการแก้ไขรายการบริการ
router.put('/:id', async (req, res) => {
    try {
        await db.ServiceItem.update(req.body, { where: { id: req.params.id } });
        req.flash('success', 'แก้ไขรายการบริการเรียบร้อยแล้ว');
        res.redirect('/service-items');
    } catch (error) {
        res.redirect('/service-items');
    }
});

// 6. ลบรายการบริการ
router.delete('/:id', async (req, res) => {
    try {
        await db.ServiceItem.destroy({ where: { id: req.params.id } });
        req.flash('success', 'ลบรายการบริการเรียบร้อยแล้ว');
        res.redirect('/service-items');
    } catch (error) {
        res.redirect('/service-items');
    }
});

module.exports = router;
