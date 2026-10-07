# Traceability Matrix (RTM): จองคิวตรวจสุขภาพ (Booking)

## สรุปผลตรวจ
- รัน test: `cd backend && pytest -v` -> 6 passed
- รัน test: `cd frontend && npm test -- --run` -> 1 passed
- ความครอบคลุมตาม spec ยังไม่สมบูรณ์: มีการ implement บาง requirement และมีข้อค้นพบที่ตรงกับ spec ไม่ได้สั่ง / ขัดกับ spec
- ประเด็นสำคัญ: ข้อความ FR-BKG-01, FR-BKG-06, DOM-PDPA-01, IF-NOT-01, IF-HIS-01 และ Q-02 ยังไม่ครบตาม spec ตามรอย

## RTM

| ID | AC | task | โค้ด / ฟังก์ชันที่ทำให้เป็นจริง | Test ที่ตรวจ | สถานะ |
|---|---|---|---|---|---|
| FR-BKG-01 | AC-BKG-05 | T-02 | `backend/app/slots/router.py:get_slots`, `backend/app/slots/service.py:list_available_slots` | `test_AC_BKG_05` (ผ่าน) | ช่องโหว่ |
| FR-BKG-02 | AC-BKG-02 | T-04 | ไม่มีการปฏิเสธการจองซ้ำวันเดียวกันใน `backend/app/booking/service.py` | ไม่มี | ยังไม่ถึง |
| FR-BKG-03 | AC-BKG-03 | T-05, T-11, T-12 | ไม่มีการแจ้ง "ช่วงเวลาเต็ม" และไม่มี 3 ตัวเลือกใกล้เคียง | ไม่มี | ยังไม่ถึง |
| FR-BKG-04 | AC-BKG-01 | T-03, T-06 | `backend/app/booking/service.py:create_booking`, `backend/app/booking/router.py:create_booking` | `test_TC_BKG_01_1_confirm_booking_last_seat`, `test_TC_BKG_01_2_boundary_single_remaining_seat`, `test_TC_BKG_01_3_reject_when_not_authenticated` (ผ่าน) | ช่องโหว่ |
| FR-BKG-05 | AC-BKG-04 | T-07 | ไม่มีคิวส่งข้อความซ้ำ/ retry ใน `backend/app/notify` หรือ `booking/service.py` | ไม่มี | ยังไม่ถึง |
| FR-BKG-06 | ไม่มี AC | T-10 | `backend/app/slots/service.py:list_available_slots` มีการกรอง `package_code` แต่ไม่มี AC หลักฐาน | ไม่มี | FR ไม่มี AC |
| NFR-PERF-01 | AC-BKG-05 | T-02 | `backend/app/slots/service.py:list_available_slots` | `test_AC_BKG_05` (ผ่าน) | ครบ |
| NFR-SEC-01 | ไม่มี AC | ไม่มี task | ไม่มีโค้ดที่บังคับ TLS 1.2+ หรือ HTTPS ใน `backend/app/` และ `frontend/src/` | ไม่มี | ยังไม่ถึง |
| NFR-REL-02 | AC-BKG-04 | T-07 | ไม่มี retry/queue logic ใน `backend/app` | ไม่มี | ยังไม่ถึง |
| NFR-USE-01 | ไม่มี AC | ไม่มี task | ไม่มี user flow หรือ test สร้างการจองภายใน 3 นาทีจริง | ไม่มี | ยังไม่ถึง |
| CON-TECH-01 | T-01 | `backend/app/config.py:DATABASE_URL`, `backend/app/db/session.py:engine`, `backend/app/db/migrations/001_init.py` | `backend/tests/test_T01_schema.py` (ผ่าน) | ครบ |
| DOM-PDPA-01 | T-01, T-08 | ไม่มี middleware log ใน `backend/app` ร่วมกับ schema `AuditLog` เท่านั้น | ไม่มี | ยังไม่ถึง |
| IF-IDP-01 | T-03 | `backend/app/auth/idp.py:get_verified_hn` | `test_TC_BKG_01_3_reject_when_not_authenticated` (ผ่าน) | ครบ |
| IF-HIS-01 | T-01, T-09 | ไม่มี `backend/app/his/client.py`; `bookings` มีเฉพาะ `hn` แต่ไม่มีการค้น HIS ด้วยเลขบัตรประชาชน | ไม่มี | ยังไม่ถึง |
| IF-NOT-01 | T-07 | ไม่มี `backend/app/notify/queue.py` หรือการวางคำขอส่งแบบ asynchronous | ไม่มี | ยังไม่ถึง |

## ข้อค้นพบ (Findings)

1. FR-BKG-01 ขัดกับ spec: ช่วงเวลาที่แสดงถูกจำกัดที่ 14 วัน
   - โค้ด: `backend/app/slots/service.py` มี `DAYS_AHEAD = 14`
   - Spec: FR-BKG-01 ระบุ "ภายใน 30 วันข้างหน้า"
   - ผล: ระบบแสดงช่วงเวลาว่างไม่ครบตาม spec แม้ test_AC_BKG_05 ผ่าน
   - ประเภท: ช่องโหว่

2. Q-02 ถูกเดาโดยใช้ตัวอย่างจากคำถามเป็นคำตอบ
   - โค้ด: `backend/app/booking/service.py:next_queue_no()` ส่งกลับ `A{count + 1:03d}`
   - Spec: Q-02 ยังเปิดไว้ให้เจ้าหน้าที่เวชระเบียนตอบ ไม่ได้มีคำตอบใน spec
   - ผล: sequence format ถูกคิดแทนทีม (guess) และขัดกับหลักการ "ไม่เดา"
   - ประเภท: ช่องโหว่

3. FR-BKG-06 ไม่มี AC และไม่ตรวจได้จริง
   - Spec มี FR-BKG-06 แต่ใน `specs/001-booking/test-cases.md` ไม่มีแถว AC ที่อ้าง FR นี้
   - ผล: requirement นี้เป็น "FR ไม่มี AC" ตามเงื่อนไขของ verify
   - ประเภท: FR ไม่มี AC

4. DOM-PDPA-01 ยังไม่เป็นจริงในโค้ด
   - Schema มี `audit_logs` ใน `backend/app/db/models.py` แต่ไม่มี `audit` middleware หรือการบันทึกทุก request ที่เข้าถึงข้อมูลการจอง
   - Spec: ต้องบันทึก audit log ทุกครั้งที่เข้าถึงข้อมูลสุขภาพ (ผู้เข้าถึง, เวลา, รหัสผู้รับบริการ)
   - ผล: requirement นี้ยังไม่ถึง
   - ประเภท: ยังไม่ถึง

5. โค้ดมี feature ที่อยู่นอก scope
   - โค้ด: `backend/app/booking/service.py:cancel_booking` และ `backend/app/booking/router.py:DELETE /bookings/{booking_id}`
   - Spec Out of scope: "ยกเลิก / เลื่อนคิว (UC-02)" และ "ชำระค่าบริการ | จัดการตารางคิวและโควตา"
   - ผล: มีฟีเจอร์ที่ไม่อยู่ใน scope ของ feature นี้
   - ประเภท: ของแถม / ไม่ตรง scope

6. TLS ถูกละเลยในโค้ด
   - ไม่มีโค้ดหรือ config ที่ enforce TLS 1.2+ หรือ HTTPS
   - Spec NFR-SEC-01 ระบุต้องเข้ารหัสข้อมูลขณะรับส่งด้วย TLS 1.2 ขึ้นไป
   - ผล: requirement ยังไม่ถึง แม้เป็น system requirement
   - ประเภท: ยังไม่ถึง

## ข้อสรุป
- โค้ดที่ผ่านการทดสอบคือส่วนของ booking สำเร็จและ slots list อย่างย่อ ส่วนมากอยู่ใน T-01 ถึง T-03
- แต่ requirement หลายข้อของ spec ยังไม่ได้ครบตามแนวทาง requirement-driven development และมีเพียง 1-2 อันที่หารายละเอียดได้จริงจาก spec
- ควรจัดลำดับงานต่อ: ตัดความคาดเคลื่อนจาก Q-02, ปรับให้ 30 วัน, เพิ่ม AC ให้ FR-BKG-06, ทำ audit logging, และ implement notification retry ตาม IF-NOT-01
