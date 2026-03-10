const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const db = require('./models'); // ดึงฐานข้อมูลมาใช้งาน
require('dotenv').config();

// --- ส่วนที่ 1: นำเข้า Routes (ไฟล์ที่บอกว่า URL ไหนต้องทำอะไร) ---
const customerRoutes = require('./routes/customerRoutes');
const carRoutes = require('./routes/carRoutes');
const mechanicRoutes = require('./routes/mechanicRoutes');
const serviceItemRoutes = require('./routes/serviceItemRoutes');
const serviceRecordRoutes = require('./routes/serviceRecordRoutes');

const app = express();

// --- ส่วนที่ 2: ตั้งค่า View Engine (ตัวที่ทำให้ใช้ EJS ได้) ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- ส่วนที่ 3: ตั้งค่า Middleware (ตัวเสริมการทำงานต่างๆ) ---
app.use(express.static(path.join(__dirname, 'public'))); // ให้ดึงไฟล์รูปภาพ/CSS จากโฟลเดอร์ public ได้
app.use(express.urlencoded({ extended: true })); // ให้อ่านค่าจากฟอร์มได้
app.use(express.json()); // ให้อ่านค่าแบบ JSON ได้
app.use(methodOverride('_method')); // ทำให้ HTML Form ใช้ PUT และ DELETE ได้
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(flash()); // ตัวช่วยแสดงข้อความแจ้งเตือน (Success/Error)

// --- ส่วนที่ 4: ตัวแปรส่วนกลาง (ให้ทุกหน้าจอ EJS เข้าถึงได้) ---
app.use((req, res, next) => {
    res.locals.success = req.flash('success'); // ข้อความสำเร็จ
    res.locals.error = req.flash('error'); // ข้อความข้อผิดพลาด
    next();
});

// --- ส่วนที่ 5: ใช้งาน Routes ---
app.use('/customers', customerRoutes);
app.use('/cars', carRoutes);
app.use('/mechanics', mechanicRoutes);
app.use('/service-items', serviceItemRoutes);
app.use('/service-records', serviceRecordRoutes);

// --- ส่วนที่ 6: หน้าแรก (Dashboard) ---
app.get('/', async (req, res) => {
    try {
        // นับจำนวนข้อมูลจากตารางต่างๆ มาแสดงที่หน้าแรก
        const customerCount = await db.Customer.count();
        const carCount = await db.Car.count();
        const serviceCount = await db.ServiceRecord.count();
        const revenue = await db.ServiceRecord.sum('totalCost') || 0;

        res.render('home', {
            customerCount,
            carCount,
            serviceCount,
            revenue: revenue.toLocaleString() // ทำให้ตัวเลขมีคอมม่า (เช่น 1,000)
        });
    } catch (error) {
        console.error(error);
        res.send('เกิดข้อผิดพลาดในการโหลดหน้า Dashboard');
    }
});

// --- ส่วนที่ 7: สั่งให้ Server เริ่มทำงาน และเชื่อมต่อฐานข้อมูล ---
const PORT = process.env.PORT || 3000;
db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server กำลังทำงานที่: http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('ไม่สามารถเชื่อมต่อฐานข้อมูลได้:', err);
});
