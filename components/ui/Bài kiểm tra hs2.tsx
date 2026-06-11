import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';

// =========================================================================
// [1] COMPONENT CON: LightControl
// - Nhận dữ liệu (isOn, brightness) và các callback function từ Component Cha qua props.
// - Hiển thị trạng thái và độ sáng nhận được.
// - Có nút chức năng gửi thao tác ngược lên Component Cha bằng callback function.
// - Tích hợp bóng đèn minh họa và 10 mức độ sáng chọn nhanh.
// =========================================================================
interface LightControlProps {
  isOn: boolean;
  brightness: number;
  onToggle: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  onSelectBrightness: (level: number) => void;
}

export function LightBulb({ isOn, brightness, size = 100 }: { isOn: boolean; brightness: number; size?: number }) {
  const currentBrightness = isOn ? brightness : 0;
  const ratio = currentBrightness / 100;

  // Màu thủy tinh thay đổi từ xám tối đến vàng sáng rực
  const bulbBg = isOn
    ? `rgba(255, 235, 59, ${0.15 + 0.85 * ratio})`
    : '#4B5563';

  const glowScale = 1.0 + ratio * 0.9;
  const glowOpacity = ratio * 0.6;

  return (
    <View style={[styles.bulbWrapper, { height: size * 1.4 }]}>
      {/* Vòng hào quang sáng */}
      {isOn && (
        <View
          style={[
            styles.glow,
            {
              width: size * 1.2,
              height: size * 1.2,
              borderRadius: (size * 1.2) / 2,
              transform: [{ scale: glowScale }],
              opacity: glowOpacity,
            },
          ]}
        />
      )}

      {/* Thân thủy tinh */}
      <View
        style={[
          styles.bulbGlass,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: bulbBg,
            borderColor: isOn ? '#F59E0B' : '#374151',
            borderWidth: size * 0.02,
          },
        ]}
      >
        {/* Dây tóc phát sáng */}
        {isOn && (
          <View style={[styles.filament, { opacity: 0.2 + 0.8 * ratio, bottom: size * 0.15 }]}>
            <View style={styles.filamentLineLeft} />
            <View style={styles.filamentLineRight} />
            <View style={styles.filamentCore} />
          </View>
        )}

        {/* Điểm bóng sáng */}
        <View
          style={[
            styles.bulbShine,
            {
              width: size * 0.25,
              height: size * 0.25,
              borderRadius: (size * 0.25) / 2,
              margin: size * 0.1,
            },
          ]}
        />
      </View>

      {/* Đuôi bóng đèn */}
      <View style={[styles.bulbNeck, { width: size * 0.36, height: size * 0.12, backgroundColor: isOn ? '#E6C000' : '#4B5563' }]} />
      <View style={[styles.bulbBase, { width: size * 0.44, height: size * 0.08, backgroundColor: isOn ? '#CCA800' : '#374151' }]} />
      <View style={[styles.bulbBase2, { width: size * 0.32, height: size * 0.08, backgroundColor: isOn ? '#B89600' : '#1F2937' }]} />
    </View>
  );
}

function LightControl({
  isOn,
  brightness,
  onToggle,
  onIncrease,
  onDecrease,
  onSelectBrightness,
}: LightControlProps) {
  const brightnessLevels = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  return (
    <View style={styles.childContainer}>
      {/* Vẽ bóng đèn chính */}
      <LightBulb isOn={isOn} brightness={brightness} size={110} />
      
      <Text style={styles.bulbLabel}>
        {isOn ? `Đèn đang sáng ở mức ${brightness}%` : 'Đèn đang tắt (Tối thui 100%)'}
      </Text>

      {/* Hiển thị dữ liệu nhận từ cha */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Trạng thái nhận được:{' '}
          <Text style={isOn ? styles.onText : styles.offText}>
            {isOn ? 'Bật' : 'Tắt'}
          </Text>
        </Text>
        <Text style={styles.infoText}>
          Độ sáng nhận được: <Text style={styles.brightText}>{brightness}%</Text>
        </Text>
      </View>

      {/* Các nút bấm gửi callback lên cha */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[styles.btn, isOn ? styles.btnOff : styles.btnOn]}
          onPress={onToggle}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>{isOn ? 'TẮT ĐÈN' : 'BẬT ĐÈN'}</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.btnSmall, styles.btnDecrease, (!isOn || brightness <= 0) && styles.btnDisabled]}
            onPress={onDecrease}
            disabled={!isOn || brightness <= 0}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>− Giảm (10)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnSmall, styles.btnIncrease, (!isOn || brightness >= 100) && styles.btnDisabled]}
            onPress={onIncrease}
            disabled={!isOn || brightness >= 100}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>+ Tăng (10)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 10 mức độ sáng chọn nhanh */}
      <Text style={styles.demoTitle}>💡 Click chọn nhanh 10 chế độ sáng:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.demoScroll}
      >
        {brightnessLevels.map((level) => {
          const isCurrent = isOn && brightness === level;
          const isOffLevel = level === 0;

          return (
            <TouchableOpacity
              key={level}
              style={[
                styles.demoItem,
                isCurrent && styles.demoItemActive,
                (!isOn && isOffLevel) && styles.demoItemActive,
              ]}
              onPress={() => onSelectBrightness(level)}
            >
              <LightBulb isOn={level > 0} brightness={level} size={45} />
              <Text style={styles.demoText}>{level}%</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// =========================================================================
// [2] COMPONENT CHA: ParentControl
// - Sử dụng useState quản lý trạng thái đèn (Bật/Tắt) và độ sáng (0 -> 100).
// - Hiển thị trạng thái và độ sáng hiện tại của đèn.
// - Truyền dữ liệu (state) và callback function xuống Component Con.
// =========================================================================
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
        <View style={styles.parentContainer}>


          <View style={styles.rowJustify}>
            <Text style={styles.label}>Trạng thái đèn:</Text>
            <Text style={isOn ? styles.onText : styles.offText}>
              {isOn ? 'Bật' : 'Tắt'}
            </Text>
          </View>

          <View style={styles.rowJustify}>
            <Text style={styles.label}>Độ sáng hiện tại:</Text>
            <Text style={styles.brightText}>{brightness}%</Text>
          </View>

          {/* Thanh hiển thị độ sáng */}
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

// ==========================================
// STYLESHEET CHUNG
// ==========================================
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
  parentContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  childContainer: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
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
  rowJustify: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  label: {
    fontSize: 15,
    color: '#555',
  },
  onText: {
    fontSize: 15,
    color: 'green',
    fontWeight: 'bold',
  },
  offText: {
    fontSize: 15,
    color: 'red',
    fontWeight: 'bold',
  },
  brightText: {
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

  // Style Bóng đèn
  bulbWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  glow: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 235, 59, 0.45)',
  },
  bulbGlass: {
    backgroundColor: '#4B5563',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    overflow: 'hidden',
    position: 'relative',
  },
  bulbShine: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  filament: {
    position: 'absolute',
    alignSelf: 'center',
    width: 20,
    height: 20,
  },
  filamentLineLeft: {
    position: 'absolute',
    left: 3,
    bottom: 0,
    width: 2,
    height: 12,
    backgroundColor: '#FF9800',
    transform: [{ rotate: '15deg' }],
  },
  filamentLineRight: {
    position: 'absolute',
    right: 3,
    bottom: 0,
    width: 2,
    height: 12,
    backgroundColor: '#FF9800',
    transform: [{ rotate: '-15deg' }],
  },
  filamentCore: {
    position: 'absolute',
    top: 2,
    alignSelf: 'center',
    width: 10,
    height: 6,
    borderTopWidth: 2,
    borderTopColor: '#FFD700',
    borderLeftWidth: 2,
    borderLeftColor: '#FFD700',
    borderRightWidth: 2,
    borderRightColor: '#FFD700',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  bulbNeck: {
    marginTop: 2,
  },
  bulbBase: {
    borderRadius: 2,
    marginTop: 2,
  },
  bulbBase2: {
    borderRadius: 2,
    marginTop: 2,
  },
  bulbLabel: {
    textAlign: 'center',
    color: '#666',
    fontSize: 13,
    marginBottom: 12,
    fontWeight: '500',
  },

  // Info box
  infoBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },

  // Buttons
  actionSection: {
    marginBottom: 16,
  },
  btn: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  btnOn: { backgroundColor: '#10B981' },
  btnOff: { backgroundColor: '#EF4444' },
  btnSmall: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnIncrease: { backgroundColor: '#F59E0B' },
  btnDecrease: { backgroundColor: '#3B82F6' },
  btnDisabled: { backgroundColor: '#E5E7EB' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  // Demo Section
  demoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    marginTop: 4,
  },
  demoScroll: {
    paddingVertical: 6,
    gap: 10,
  },
  demoItem: {
    width: 70,
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  demoItemActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  demoText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#4B5563',
    marginTop: 4,
  },
});
