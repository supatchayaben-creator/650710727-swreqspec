# Tasks: จองคิวตรวจสุขภาพ (Booking)
- Feature: จองคิวตรวจสุขภาพ (Booking)
- Spec ID: SPEC-BKG-001
- อ้างอิง plan.md: specs/001-booking/plan.md
- วันที่: 2569-09-23

## สรุป
- ทำทั้งหมด 10 task
- มี 1 task ที่ต้องรอ Open Question (Q-02)

## รายการ task

### T-01 สร้าง schema ฐานข้อมูลและ migration
- รองรับ: CON-TECH-01, DOM-PDPA-01, IF-HIS-01
- ตรวจด้วย: AC-BKG-06
- ไฟล์ที่แตะ: backend/app/db/models.py, backend/app/db/migrations/001_init.py, backend/app/db/session.py
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: migration สร้างตาราง slots, bookings, audit_logs ใน PostgreSQL และตาราง bookings เก็บเฉพาะ hn ไม่มีเลขบัตรประชาชน
- สถานะ: พร้อมทำ

### T-02 สร้าง API ค้นช่วงว่างและคำนวณแพ็กเกจ
- รองรับ: FR-BKG-01, FR-BKG-06, NFR-PERF-01
- ตรวจด้วย: AC-BKG-05
- ไฟล์ที่แตะ: backend/app/slots/router.py, backend/app/slots/service.py, backend/tests/test_AC_BKG_05.py
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: GET /slots คืนช่วงเวลาว่างและจำนวนที่นั่งคงเหลือภายใน 30 วันข้างหน้า พร้อมวัด p95 ของเวลา response ไม่เกิน 2 วินาที ภายใต้สถานการณ์ผู้ใช้พร้อมกัน 200 คน
- สถานะ: พร้อมทำ

### T-03 สร้างบริการจองพื้นฐานและตัดที่นั่ง
- รองรับ: FR-BKG-04, IF-IDP-01, IF-HIS-01
- ตรวจด้วย: AC-BKG-01
- ไฟล์ที่แตะ: backend/app/booking/router.py, backend/app/booking/service.py, backend/app/auth/idp.py, backend/tests/test_AC_BKG_01.py
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: POST /bookings บันทึกการจองได้สำเร็จ ลด remaining ของช่วงนั้นให้เป็น 0 และคืนหมายเลขคิวให้ผู้ใช้เห็น
- สถานะ: พร้อมทำ

### T-04 ป้องกันการจองซ้ำในวันเดียวกัน
- รองรับ: FR-BKG-02
- ตรวจด้วย: AC-BKG-02
- ไฟล์ที่แตะ: backend/app/booking/service.py, backend/tests/test_AC_BKG_02.py
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: เมื่อมีคิวที่ยังไม่ได้ใช้ในวันเดียวกัน ระบบปฏิเสธการจองใหม่และส่งกลับหมายเลขคิวเดิม
- สถานะ: พร้อมทำ

### T-05 จัดการช่วงเต็มและเสนอ 3 ช่วงที่ใกล้ที่สุด
- รองรับ: FR-BKG-03
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: backend/app/booking/service.py, backend/app/slots/service.py, backend/tests/test_AC_BKG_03.py
- ต้องทำหลัง: T-03, T-04
- เสร็จเมื่อ: เมื่อช่วง 09.00 น. เต็ม ระบบตอบกลับ 409 พร้อม 3 ช่วงว่างที่ใกล้ที่สุดภายในวันเดียวกันและวันถัดไป และไม่สร้างรายการจองซ้อนกัน
- สถานะ: พร้อมทำ

### T-06 จัดการคิวส่งข้อความแบบ asynchronous และส่งซ้ำภายใน 5 นาที
- รองรับ: FR-BKG-05, NFR-REL-02, IF-NOT-01, ASM-03
- ตรวจด้วย: AC-BKG-04
- ไฟล์ที่แตะ: backend/app/notify/queue.py, backend/app/booking/service.py, backend/tests/test_AC_BKG_04.py
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: การจองยังถูกบันทึกแม้ระบบแจ้งเตือนไม่ตอบสนอง และมีงานค้างส่งที่ถูกกำหนดให้ส่งซ้ำภายใน 5 นาที
- สถานะ: พร้อมทำ

### T-07 บันทึก audit log ทุกการเข้าถึงข้อมูลการจอง
- รองรับ: DOM-PDPA-01
- ตรวจด้วย: AC-BKG-06
- ไฟล์ที่แตะ: backend/app/audit/middleware.py, backend/app/main.py, backend/app/db/models.py
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: ทุก request ที่เข้าถึงข้อมูลการจองมี audit log ที่บันทึก actor_id, accessed_at และ hn วางอยู่ในฐานข้อมูลและพร้อมค้นดูได้
- สถานะ: พร้อมทำ

### T-08 สร้างหน้าจอเลือกแพ็กเกจและช่วงเวลาแบบ mock API
- รองรับ: FR-BKG-01, FR-BKG-06
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-02
- ไฟล์ที่แตะ: frontend/src/pages/SlotPicker.jsx, frontend/src/App.jsx, frontend/src/api/client.js
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: ผู้ใช้เลือกแพ็กเกจและดูช่วงเวลา/จำนวนที่นั่งคงเหลือได้บนหน้าจอ โดยใช้ API จำลองตามสัญญาใน plan.md
- สถานะ: พร้อมทำ

### T-09 สร้างหน้าจอยืนยันและผลลัพธ์เชื่อม API จริง
- รองรับ: FR-BKG-03, FR-BKG-04, FR-BKG-05
- ตรวจด้วย: AC-BKG-03, AC-BKG-04
- ไฟล์ที่แตะ: frontend/src/pages/ConfirmBooking.jsx, frontend/src/pages/BookingResult.jsx, frontend/src/__tests__/AC-BKG-03.test.jsx
- ต้องทำหลัง: T-02, T-05, T-08
- เสร็จเมื่อ: หน้ายืนยันแสดง "ช่วงเวลาเต็ม" พร้อม 3 ตัวเลือกที่ใกล้ที่สุด และหน้าแสดงผลการจองแสดงหมายเลขคิวแม้ส่งข้อความไม่สำเร็จ
- สถานะ: พร้อมทำ

### T-10 ออกแบบรูปแบบหมายเลขคิวตาม Q-02
- รองรับ: Q-02
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-03
- ไฟล์ที่แตะ: backend/app/db/models.py, backend/app/booking/service.py
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: ทีมตอบคำถาม Q-02 ว่าเลขคิวรีเซ็ตทุกวันหรือไหลต่อและรูปแบบคืออะไร แล้วระบบปรับให้สอดคล้องตามคำตอบ
- สถานะ: รอ Q-02

## ตารางตรวจความครบ

### 1) AC ID | task ที่ตรวจ AC นี้
| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-BKG-01 | T-03 |
| AC-BKG-02 | T-04 |
| AC-BKG-03 | T-05, T-09 |
| AC-BKG-04 | T-06, T-09 |
| AC-BKG-05 | T-02 |
| AC-BKG-06 | T-01, T-07 |

### 2) Constraint ID | task ที่ทำให้เป็นจริง
| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| CON-TECH-01 | T-01 |
| DOM-PDPA-01 | T-01, T-07 |
| IF-IDP-01 | T-03 |
| IF-HIS-01 | T-01, T-03 |
| IF-NOT-01 | T-06 |

## สิ่งที่ยังไม่ทำ
- Q-02: หมายเลขคิวรีเซ็ตรายวัน หรือนับต่อเนื่อง และมีรูปแบบอย่างไร (เช่น A001)? -> ถามเจ้าหน้าที่เวชระเบียน (ยังไม่ได้คำตอบ)
  - รอ task: T-10
