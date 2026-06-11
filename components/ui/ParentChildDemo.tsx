import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// ==========================================================
// 👶 1. COMPONENT CON (CHILD COMPONENT) - Giao diện hiện đại
// ==========================================================
interface ChildProps {
  // Props nhận từ Cha:
  tenCuaCha: string;
  tuoiCuaCha: string;
  // Callback truyền ngược lên Cha:
  guiDuLieuLenCha: (tenCon: string, tuoiCon: string) => void;
}

export const ChildComponent: React.FC<ChildProps> = ({
  tenCuaCha,
  tuoiCuaCha,
  guiDuLieuLenCha
}) => {
  // State tại Con
  const [tenConInput, setTenConInput] = useState('Nguyen Van B');
  const [tuoiConInput, setTuoiConInput] = useState('10');

  return (
    <View style={styles.childBox}>
      {/* Tiêu đề Badge kiểu mới sang trọng */}
      <View style={styles.badgeCon}>
        <Text style={styles.titleCon}>👦 COMPONENT CON (CHILD)</Text>
      </View>

      {/* Box hiển thị thông tin nhận từ Cha - có viền nhấn bên trái (borderLeft) */}
      <View style={[styles.infoBox, styles.infoBoxCon]}>
        <Text style={styles.infoTitleCon}>📥 Dữ liệu nhận từ Cha (Props):</Text>
        <View style={styles.row}>
          <Text style={styles.infoLabel}>Tên của Cha:</Text>
          <Text style={styles.boldTextValue}>{tenCuaCha || '(Trống)'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.infoLabel}>Tuổi của Cha:</Text>
          <Text style={styles.boldTextValue}>
            {tuoiCuaCha ? `${tuoiCuaCha} tuổi` : '(Trống)'}
          </Text>
        </View>
      </View>

      {/* Form nhập dữ liệu để gửi lên Cha */}
      <Text style={styles.label}>Nhập dữ liệu gửi lên Cha:</Text>
      <TextInput
        style={[styles.input, styles.inputConFocus]}
        placeholder="Nhập tên con..."
        placeholderTextColor="#94a3b8"
        value={tenConInput}
        onChangeText={setTenConInput}
      />
      <TextInput
        style={[styles.input, styles.inputConFocus]}
        placeholder="Nhập tuổi con..."
        placeholderTextColor="#94a3b8"
        value={tuoiConInput}
        onChangeText={setTuoiConInput}
        keyboardType="numeric"
      />

      {/* Nút gửi dữ liệu lên Cha với bóng đổ mượt */}
      <TouchableOpacity
        style={styles.btnCon}
        onPress={() => {
          guiDuLieuLenCha(tenConInput, tuoiConInput);
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>Gửi dữ liệu lên Cha ⬆️</Text>
      </TouchableOpacity>
    </View>
  );
};


// ==========================================================
// 👨 2. COMPONENT CHA (PARENT COMPONENT) - Giao diện hiện đại
// ==========================================================
export default function ParentComponent() {
  // State tại Cha gửi xuống
  const [tenChaInput, setTenChaInput] = useState('Nguyen Van A');
  const [tuoiChaInput, setTuoiChaInput] = useState('45');

  // State nhận từ Con
  const [tenConNhanDuoc, setTenConNhanDuoc] = useState('');
  const [tuoiConNhanDuoc, setTuoiConNhanDuoc] = useState('');

  // Hàm Callback nhận dữ liệu từ Con
  const handleNhanDuLieuTuCon = (tenCon: string, tuoiCon: string) => {
    setTenConNhanDuoc(tenCon);
    setTuoiConNhanDuoc(tuoiCon);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.parentBox}>
          {/* Tiêu đề Badge kiểu mới sang trọng */}
          <View style={styles.badgeCha}>
            <Text style={styles.titleCha}>👨 COMPONENT CHA (PARENT)</Text>
          </View>

          {/* Box hiển thị thông tin nhận từ Con - có viền nhấn bên trái */}
          <View style={[styles.infoBox, styles.infoBoxCha]}>
            <Text style={styles.infoTitleCha}>📥 Dữ liệu nhận từ Con (Callback):</Text>
            <View style={styles.row}>
              <Text style={styles.infoLabel}>Tên của Con:</Text>
              <Text style={styles.boldTextValue}>{tenConNhanDuoc || '(Chưa nhận)'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.infoLabel}>Tuổi của Con:</Text>
              <Text style={styles.boldTextValue}>
                {tuoiConNhanDuoc ? `${tuoiConNhanDuoc} tuổi` : '(Chưa nhận)'}
              </Text>
            </View>
          </View>

          {/* Form nhập dữ liệu để truyền xuống Con */}
          <Text style={styles.label}>Nhập dữ liệu gửi xuống Con:</Text>
          <TextInput
            style={[styles.input, styles.inputChaFocus]}
            placeholder="Nhập tên cha..."
            placeholderTextColor="#94a3b8"
            value={tenChaInput}
            onChangeText={setTenChaInput}
          />
          <TextInput
            style={[styles.input, styles.inputChaFocus]}
            placeholder="Nhập tuổi cha..."
            placeholderTextColor="#94a3b8"
            value={tuoiChaInput}
            onChangeText={setTuoiChaInput}
            keyboardType="numeric"
          />
        </View>

        {/* Gọi component Con */}
        <ChildComponent
          tenCuaCha={tenChaInput}
          tuoiCuaCha={tuoiChaInput}
          guiDuLieuLenCha={handleNhanDuLieuTuCon}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================================
// 🎨 3. STYLES (ĐỊNH DẠNG PREMIUM & DYNAMIC)
// ==========================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f1f5f9', // Nền xám nhạt hiện đại, dễ chịu
  },
  scrollContainer: {
    padding: 16,
    paddingVertical: 24,
  },

  // 👨 Khung Component Cha (Parent Card)
  parentBox: {
    backgroundColor: '#ffffff',
    borderRadius: 24, // Bo góc lớn hiện đại
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    marginBottom: 20,
    // Hiệu ứng đổ bóng mờ premium
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  badgeCha: {
    backgroundColor: '#eff6ff',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  titleCha: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1d4ed8',
    letterSpacing: 0.5,
  },
  infoBoxCha: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6', // Viền xanh nhấn ở bên trái
    backgroundColor: '#f8fafc',
  },
  infoTitleCha: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 6,
  },
  inputChaFocus: {
    borderColor: '#3b82f6',
  },

  // 👶 Khung Component Con (Child Card)
  childBox: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    // Hiệu ứng đổ bóng mờ premium
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  badgeCon: {
    backgroundColor: '#ecfdf5',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  titleCon: {
    fontSize: 16,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: 0.5,
  },
  infoBoxCon: {
    borderLeftWidth: 4,
    borderLeftColor: '#10b981', // Viền xanh lá nhấn bên trái
    backgroundColor: '#f8fafc',
  },
  infoTitleCon: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065f46',
    marginBottom: 6,
  },
  inputConFocus: {
    borderColor: '#10b981',
  },
  btnCon: {
    backgroundColor: '#10b981',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  btnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.3,
  },

  // Các style dùng chung
  infoBox: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  boldTextValue: {
    fontWeight: '800',
    color: '#1e293b',
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
});
