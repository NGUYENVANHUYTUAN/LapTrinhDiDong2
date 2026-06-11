import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PHEP_TINH = [
  { label: 'Cộng  (+)', value: '+' },
  { label: 'Trừ   (−)', value: '-' },
  { label: 'Nhân  (×)', value: '*' },
  { label: 'Chia  (÷)', value: '/' },
  { label: 'So sánh A và B', value: 'ss' },
];

export default function Calculator() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [kq, setKq] = useState('');
  const [phepChon, setPhepChon] = useState('+');

  const thucHien = () => {
    const x = parseFloat(a), y = parseFloat(b);
    if (isNaN(x) || isNaN(y)) return Alert.alert('Lỗi', 'Nhập số hợp lệ!');

    if (phepChon === 'ss') {
      if (x > y) setKq(`${x} > ${y}`);
      else if (x < y) setKq(`${x} < ${y}`);
      else setKq(`${x} = ${y}`);
      return;
    }

    if (phepChon === '/' && y === 0) return Alert.alert('Lỗi', 'Không chia cho 0!');

    const ops: Record<string, number> = {
      '+': x + y,
      '-': x - y,
      '*': x * y,
      '/': x / y,
    };
    setKq(`${x} ${phepChon} ${y} = ${ops[phepChon]}`);
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Máy Tính</Text>

      <TextInput
        style={s.input}
        value={a}
        onChangeText={setA}
        keyboardType="numeric"
        placeholder="Số A"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={s.input}
        value={b}
        onChangeText={setB}
        keyboardType="numeric"
        placeholder="Số B"
        placeholderTextColor="#aaa"
      />

      {/* Radio Options */}
      <Text style={s.label}>Chọn phép tính:</Text>
      {PHEP_TINH.map(({ label, value }) => (
        <TouchableOpacity
          key={value}
          style={s.radioRow}
          onPress={() => setPhepChon(value)}
          activeOpacity={0.6}
        >
          {/* Vòng tròn ngoài */}
          <View style={[s.radioOuter, phepChon === value && s.radioOuterActive]}>
            {/* Chấm trong khi được chọn */}
            {phepChon === value && <View style={s.radioInner} />}
          </View>
          <Text style={[s.radioLabel, phepChon === value && s.radioLabelActive]}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Nút thực hiện duy nhất */}
      <TouchableOpacity style={s.btnTinh} onPress={thucHien}>
        <Text style={s.btnText}>Thực hiện</Text>
      </TouchableOpacity>

      {kq ? <Text style={s.kq}>{kq}</Text> : null}

      <TouchableOpacity onPress={() => { setA(''); setB(''); setKq(''); setPhepChon('+'); }}>
        <Text style={s.xoa}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },

  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, fontSize: 16, marginBottom: 10, color: '#333',
  },

  label: {
    fontSize: 15, fontWeight: '600', color: '#333',
    marginTop: 8, marginBottom: 6,
  },

  // --- Radio ---
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,          // khoảng cách dọc giữa các dòng
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#aaa',         // màu mặc định (chưa chọn)
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioOuterActive: {
    borderColor: '#2196f3',      // màu xanh khi chọn
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#2196f3', // chấm xanh bên trong
  },
  radioLabel: {
    fontSize: 16,
    color: '#555',
  },
  radioLabelActive: {
    color: '#2196f3',
    fontWeight: '600',
  },

  // --- Buttons ---
  btnTinh: {
    backgroundColor: '#2196f3',
    padding: 14, borderRadius: 8,
    alignItems: 'center', marginTop: 14,
  },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  kq: {
    fontSize: 22, fontWeight: 'bold',
    textAlign: 'center', marginTop: 20, color: '#333',
  },
  xoa: { color: 'red', textAlign: 'center', marginTop: 20, fontSize: 16 },
});
