import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import SlotPicker from '../pages/SlotPicker.jsx'

const mockClient = {
  getSlots: vi.fn(async () => [
    { slot_date: '2026-09-23', start_time: '09:00', remaining: 0 },
    { slot_date: '2026-09-23', start_time: '10:00', remaining: 4 },
    { slot_date: '2026-09-24', start_time: '08:30', remaining: 2 },
    { slot_date: '2026-09-24', start_time: '09:00', remaining: 1 },
  ]),
}

describe('AC-BKG-03: slot picker shows nearby availability', () => {
  it('renders available slots and availability counts for the selected package', async () => {
    render(<SlotPicker client={mockClient} initialPackageCode="general" />)

    expect(screen.getByText('เลือกแพ็กเกจและช่วงเวลา')).toBeTruthy()
    expect((await screen.findAllByText('09:00')).length).toBeGreaterThan(0)
    expect(screen.getByText('4')).toBeTruthy()
    expect(screen.getAllByText('ที่นั่งคงเหลือ').length).toBeGreaterThan(0)
  })
})
