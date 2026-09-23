import SlotPicker from './pages/SlotPicker.jsx'

// รองรับ FR-BKG-01 และ FR-BKG-06 โดยแสดงแพ็กเกจและช่วงเวลาว่างให้ผู้ใช้เลือกได้
export default function App() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-teal-800">ระบบจองคิวตรวจสุขภาพ</h1>
      </div>
      <SlotPicker />
    </main>
  )
}
