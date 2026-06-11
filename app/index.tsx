if (typeof global.setImmediate === 'undefined') {
  (global as any).setImmediate = (fn: (...args: any[]) => void, ...args: any[]) => global.setTimeout(fn, 0, ...args);
}

import { CartProvider } from '@/components/final_mobile_2/context/CartContext';
import AppNavigator from '@/components/final_mobile_2/navigation/AppNavigator';
import React from 'react';

// Bài thực hành: Điều hướng với bottom tab và stack
export default function App() {
  return <AppNavigator />;
}





