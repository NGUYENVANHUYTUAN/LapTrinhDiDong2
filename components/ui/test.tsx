// ===== COMPONENT CHA SỬ DỤNG useState =====

import { useState } from 'react'; // ← Import useState từ React

export default function ParentControl() {

  // [1] Quản lý trạng thái đèn: Bật (true) / Tắt (false)
  const [isOn, setIsOn] = useState<boolean>(false);

  // [2] Quản lý độ sáng: từ 0 đến 100
  const [brightness, setBrightness] = useState<number>(50);

}
