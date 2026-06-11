import React, { useState } from 'react';
import { Text, View, Alert, StyleSheet, TextInput } from 'react-native';
import MyButton from './MyButton'; // ✅ Sử dụng button riêng đã tạo

type Props = {
  initialName?: string;
  initialAge?: number;
};

function HelloInfo({ initialName = '', initialAge }: Props) {
  // ✅ Quản lý state cho Name, Age và trạng thái hiển thị
  const [name, setName] = useState(initialName);
  const [age, setAge] = useState(initialAge ? String(initialAge) : '');
  const [showExercise, setShowExercise] = useState(false);

  // Xử lý khi nhấn nút "Xem kết quả & Bài tập 2"
  const handleGoToExercise = () => {
    if (!name.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên của bạn!');
      return;
    }
    if (!age.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tuổi của bạn!');
      return;
    }
    setShowExercise(true);
  };

  // Xử lý khi nhấn "Nhấn vào đây" ở màn hình kết quả
  const handlePressHello = () => {
    Alert.alert('Lời chào', `Hello ${name}, ${age} tuổi!`);
  };

  // Quay lại màn hình nhập liệu
  const handleBack = () => {
    setShowExercise(false);
  };

  return (
    <View style={styles.container}>
      {!showExercise ? (
        // ---------------- MÀN HÌNH 1: NHẬP LIỆU (HelloState) ----------------
        <View style={styles.formContainer}>
          <Text style={styles.titleForm}>HelloState Form</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên của bạn:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập tên..."
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tuổi của bạn:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập tuổi..."
              placeholderTextColor="#9ca3af"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>

          {/* ✅ Sử dụng MyButton riêng */}
          <MyButton
            title="Xem Bài Tập 2"
            onPress={handleGoToExercise}
            style={styles.submitButton}
            textStyle={styles.submitButtonText}
          />
        </View>
      ) : (
        // ---------------- MÀN HÌNH 2: HIỂN THỊ KẾT QUẢ (HelloInfo) ----------------
        <View style={styles.exerciseContainer}>
          <Text style={styles.titleResult}>👋 Xin chào!</Text>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.ageText}>{age} tuổi</Text>

          {/* ✅ Nút hiển thị Lời chào */}
          <MyButton
            title="Nhấn vào đây"
            onPress={handlePressHello}
            style={styles.helloButton}
            textStyle={styles.buttonTextShared}
          />

          {/* ✅ Nút quay lại màn hình nhập liệu */}
          <MyButton
            title="Quay lại"
            onPress={handleBack}
            style={styles.backButton}
            textStyle={styles.buttonTextShared}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827', // Nền tối hiện đại, cao cấp
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // Style cho Form Nhập Liệu
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1f2937',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  titleForm: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6', // Màu xanh dương hiện đại
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#e5e7eb',
    marginBottom: 6,
    fontWeight: '600',
  },
  textInput: {
    color: '#ffffff',
    fontSize: 18,
    borderWidth: 1.5,
    borderRadius: 12,
    borderColor: '#4b5563',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#374151',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    width: '100%',
    borderRadius: 12,
    marginTop: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 20,
  },

  // Style cho màn hiển thị kết quả (Bài tập 2)
  exerciseContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1f2937',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  titleResult: {
    fontSize: 24,
    color: '#fb923c',
    marginBottom: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  nameText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  ageText: {
    fontSize: 20,
    color: '#fdba74',
    marginBottom: 32,
  },
  helloButton: {
    backgroundColor: '#ea580c', // Màu cam nổi bật
    width: '100%',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  backButton: {
    backgroundColor: '#4b5563', // Màu xám quay lại
    width: '100%',
    borderRadius: 12,
    shadowColor: '#4b5563',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonTextShared: {
    color: '#ffffff',
    fontSize: 20,
  },
});

export default HelloInfo;
