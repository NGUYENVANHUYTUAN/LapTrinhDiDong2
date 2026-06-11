import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Calculator() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [kq, setKq] = useState('');

  const tinh = (phep: string) => {
    const x = parseFloat(a), y = parseFloat(b);
    if (isNaN(x) || isNaN(y)) return Alert.alert('Lỗi', 'Nhập số hợp lệ!');
    if (phep === '/' && y === 0) return Alert.alert('Lỗi', 'Không chia cho 0!');

    const ops: any = { '+': x + y, '-': x - y, '*': x * y, '/': x / y };
    if (ops[phep] !== undefined) return setKq(`${x} ${phep} ${y} = ${ops[phep]}`);

    // So sánh
    if (x > y) setKq(`${x} > ${y}`);
    else if (x < y) setKq(`${x} < ${y}`);
    else setKq(`${x} = ${y}`);
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Máy Tính</Text>

      <TextInput style={s.input} value={a} onChangeText={setA} keyboardType="numeric" placeholder="Số A" />
      <TextInput style={s.input} value={b} onChangeText={setB} keyboardType="numeric" placeholder="Số B" />

      <View style={s.row}>
        {['+', '-', '*', '/'].map(p => (
          <TouchableOpacity key={p} style={s.btn} onPress={() => tinh(p)}>
            <Text style={s.btnText}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.row}>
        <TouchableOpacity style={[s.btn, { backgroundColor: '#607d8b', marginTop: 8 }]} onPress={() => tinh('ss')}>
          <Text style={s.btnText}>So sánh A và B</Text>
        </TouchableOpacity>
      </View>

      {kq ? <Text style={s.kq}>{kq}</Text> : null}

      <TouchableOpacity onPress={() => { setA(''); setB(''); setKq(''); }}>
        <Text style={s.xoa}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 10 },
  row: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, backgroundColor: '#2196f3', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  kq: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 20, color: '#333' },
  xoa: { color: 'red', textAlign: 'center', marginTop: 20, fontSize: 16 },
});
