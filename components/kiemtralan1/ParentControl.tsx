// =========================================================
// HỆ THỐNG ĐIỀU KHIỂN ĐÈN THÔNG MINH - COMPONENT CHA (ParentControl)
// - Sử dụng useState quản lý trạng thái đèn (Bật/Tắt) và độ sáng (0 -> 100).
// - Hiển thị trạng thái và độ sáng hiện tại của đèn.
// - Truyền dữ liệu (state) và callback function xuống Component Con.
// =========================================================
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import LightControl from './LightControl';

export default function ParentControl() {
  const [isOn, setIsOn] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(50);

  const handleToggle = () => setIsOn(prev => !prev);

  const handleIncrease = () => {
    if (brightness < 100) setBrightness(prev => prev + 10);
  };

  const handleDecrease = () => {
    if (brightness > 0) setBrightness(prev => prev - 10);
  };

  const handleSelectBrightness = (level: number) => {
    if (level === 0) {
      setIsOn(false);
      setBrightness(0);
    } else {
      setIsOn(true);
      setBrightness(level);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>


        {/* ===== COMPONENT CHA ===== */}
        <View style={styles.card}>

          <View style={styles.row}>
            <Text style={styles.label}>Trạng thái đèn:</Text>
            <Text style={isOn ? styles.on : styles.off}>
              {isOn ? 'Bật' : 'Tắt'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Độ sáng hiện tại:</Text>
            <Text style={styles.bright}>{brightness}%</Text>
          </View>

          {/* Thanh độ sáng */}
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${brightness}%` as any }]} />
          </View>
        </View>

        {/* ===== COMPONENT CON ===== */}
        <LightControl
          isOn={isOn}
          brightness={brightness}
          onToggle={handleToggle}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onSelectBrightness={handleSelectBrightness}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  scroll: {
    padding: 16,
    paddingTop: 30,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E293B',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    color: '#555',
  },
  on: {
    fontSize: 15,
    color: 'green',
    fontWeight: 'bold',
  },
  off: {
    fontSize: 15,
    color: 'red',
    fontWeight: 'bold',
  },
  bright: {
    fontSize: 15,
    color: '#F59E0B',
    fontWeight: 'bold',
  },
  barTrack: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    marginTop: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 5,
  },
});
