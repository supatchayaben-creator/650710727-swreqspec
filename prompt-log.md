# Prompt log

บันทึกทุกครั้งที่ใช้ AI กับ repo นี้ เขียนต่อท้ายเรื่อย ๆ ไม่ต้องลบของเก่า

---

## 2569-09-16 11:00 คำสั่ง: /plan

- เครื่องมือ: Copilot ใน Codespaces
- ผลลัพธ์: specs/001-booking/plan.md
- Constraint ที่ AI ยังไม่ได้ใช้: ไม่มี
- สิ่งที่ AI บอกว่าอยากเดาแต่ไม่ได้เดา:
  - Q-01: “ช่วงเวลาใกล้เคียง” ควรคำนวณเฉพาะวันเดียวกันหรือรวมวันถัดไปด้วย
  - Q-02: หมายเลขคิวควรรีเซ็ตทุกวันหรือเริ่มนับต่อเนื่อง
  - Q-03: “คิวที่ยังไม่ได้ใช้” ควรรวมคิวที่บันทึกแล้วแต่ยังไม่ได้ส่งข้อความยืนยันหรือไม่
  - Q-04: “สมดุลตามโควตา” ต้องถูกบังคับจริงหรือเป็นเพียงการแสดงข้อมูลเท่านั้น

---

## 2569-09-23 11:25 คำสั่ง: /tasks

- เครื่องมือ: Copilot ใน Codespaces
- ผลลัพธ์: specs/001-booking/tasks.md
- สรุป: สร้าง task list เรียงลำดับตามพึ่งพาแล้ว ครอบคลุม AC ทั้ง 6 ข้อ และ Constraint ทั้ง 5 ข้อ โดยมี 1 task ที่รอ Q-02 (หมายเลขคิว)
- สิ่งที่ AI ระบุว่า still blocked:
  - Q-02: ยังไม่ทราบว่าควรรีเซ็ตคิวทุกวันหรือไหลต่อ และรูปแบบหมายเลขคิวควรเป็นแบบใด
- กฎที่ยึด: ไม่เริ่มทำโค้ดใด ๆ และทุก task มีการอ้างอิงกลับไปยัง FR / AC / Constraint ใน spec และ plan

---

## 2569-09-23 11:35 คำสั่ง: /implement T-01

- เครื่องมือ: Copilot ใน Codespaces
- ไฟล์ที่สร้างหรือแก้: backend/app/__init__.py, backend/app/db/__init__.py, backend/app/db/models.py, backend/app/db/session.py, backend/app/db/migrations/001_init.py, backend/tests/test_AC_BKG_06.py
- ผล test: pytest tests/test_AC_BKG_06.py -q
- ผลลัพธ์: ผ่านหลังแก้ตัว import ทดสอบให้หลีกเลี่ยงชื่อโมดูลที่ขึ้นต้นด้วยตัวเลข และยังยืนยัน schema ที่ต้องมี slots, bookings, audit_logs พร้อม field hn และไม่มี national_id
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ไม่มี เพราะมี spec และ plan ชัดเจนสำหรับ T-01

---

## 2569-09-23 11:55 คำสั่ง: /implement T-08

- เครื่องมือ: Copilot ใน Codespaces
- ไฟล์ที่สร้างหรือแก้: frontend/src/App.jsx, frontend/src/pages/SlotPicker.jsx, frontend/src/__tests__/AC-BKG-03.test.jsx
- ผล test: npm test -- --run src/__tests__/AC-BKG-03.test.jsx
- ผลลัพธ์: ผ่านหลังปรับ assertion ให้รองรับการแสดงเวลา 09:00 ซ้ำใน mock dataset และยืนยัน UI แสดงแพ็กเกจที่เลือกและค่าสถานะที่นั่งคงเหลือได้
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ไม่มี เพราะ spec และ plan ระบุชัดว่าหน้าจอเลือกแพ็กเกจและช่วงเวลาใช้ API จำลองตามสัญญาและไม่ต้องรอ task API

---
