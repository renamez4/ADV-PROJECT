# ER Diagram: โครงสร้างฐานข้อมูลระบบศูนย์บริการรถยนต์

คุณสามารถนำโค้ดด้านล่างนี้ไปใช้เพื่อสร้างรูปภาพไดอะแกรมที่สวยงามได้ครับ

## 1. สำหรับใช้ที่ [dbdiagram.io](https://dbdiagram.io)
คัดลอกข้อความด้านล่างนี้ไปวางในเว็บไซต์เพื่อสร้างรูปภาพอัตโนมัติ:

```dbml
Table Customers {
  id integer [primary key]
  fullName varchar
  phone varchar
  email varchar
}

Table Cars {
  id integer [primary key]
  plateNumber varchar
  brand varchar
  model varchar
  customerId integer
}

Table Mechanics {
  id integer [primary key]
  mechanicName varchar
  skillLevel varchar
  phone varchar
}

Table ServiceItems {
  id integer [primary key]
  itemName varchar
  price decimal
}

Table ServiceRecords {
  id integer [primary key]
  serviceDate date
  carId integer
  mechanicId integer
  description text
  totalCost decimal
}

Table ServiceDetails {
  id integer [primary key]
  serviceRecordId integer
  serviceItemId integer
  unitPrice decimal
}

// Relationships
Ref: "Customers"."id" < "Cars"."customerId"
Ref: "Cars"."id" < "ServiceRecords"."carId"
Ref: "Mechanics"."id" < "ServiceRecords"."mechanicId"
Ref: "ServiceRecords"."id" < "ServiceDetails"."serviceRecordId"
Ref: "ServiceItems"."id" < "ServiceDetails"."serviceItemId"
```

---

## 2. คำอธิบายความสัมพันธ์ (สำหรับอธิบายอาจารย์)
1.  **One-to-Many (1:N)**: 
    *   ลูกค้า 1 คน สามารถมีรถได้หลายคัน
    *   รถ 1 คัน สามารถมีประวัติการซ่อมได้หลายครั้ง
    *   ช่าง 1 คน สามารถดูแลการซ่อมได้หลายครั้ง
2.  **Many-to-Many (N:M)**:
    *   การซ่อม 1 ครั้ง มีได้หลายรายการบริการ และบริการ 1 อย่าง อยู่ในหลายการซ่อมได้ (ใช้ตาราง `ServiceDetails` เป็นตัวเชื่อม)
