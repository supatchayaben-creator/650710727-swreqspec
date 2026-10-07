# AC-BKG-01: บันทึกการจอง สำเร็จเมื่อยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง
from app.db.models import Booking
from tests.conftest import AUTH


def test_TC_BKG_01_1_confirm_booking_last_seat(client, db, make_slot):
    # Given: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
    slot = make_slot(start="09:00", remaining=1)

    # When: ยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    # Then: บันทึกการจองสำเร็จ แสดงหมายเลขคิว (รอ Q-02) และที่นั่งว่างของช่วงนั้นเป็น 0
    assert res.status_code == 201
    payload = res.json()
    assert payload["slot_id"] == slot.id
    assert payload["queue_no"] is not None
    db.refresh(slot)
    assert slot.remaining == 0
    assert db.query(Booking).filter_by(slot_id=slot.id).count() == 1


def test_TC_BKG_01_2_boundary_single_remaining_seat(client, db, make_slot):
    # Given: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่างเท่ากับ 1 ที่ พร้อมก่อนยืนยันไม่มีรายการจองในช่วงนี้
    slot = make_slot(start="09:00", remaining=1)

    # When: ยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    # Then: บันทึกการจองสำเร็จ แสดงหมายเลขคิว (รอ Q-02) และลดจำนวนที่นั่งจาก 1 เป็น 0
    assert res.status_code == 201
    payload = res.json()
    assert payload["queue_no"] == "A001"
    db.refresh(slot)
    assert slot.remaining == 0
    booking = db.query(Booking).filter_by(slot_id=slot.id).one()
    assert booking.hn == "0001234"


def test_TC_BKG_01_3_reject_when_not_authenticated(client, db, make_slot):
    # Given: ยังไม่ยืนยันตัวตน และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
    slot = make_slot(start="09:00", remaining=1)

    # When: ยืนยันการจองโดยไม่มีข้อมูลยืนยันตัวตน
    res = client.post("/bookings", json={"slot_id": slot.id})

    # Then: ระบบปฏิเสธการจอง ไม่บันทึกการจอง และไม่ลดที่นั่งของช่วงนั้น
    assert res.status_code == 401
    db.refresh(slot)
    assert slot.remaining == 1
    assert db.query(Booking).count() == 0
