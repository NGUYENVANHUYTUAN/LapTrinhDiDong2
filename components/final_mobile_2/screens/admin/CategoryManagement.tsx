import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as db from '../../database/db';

export default function CategoryManagement({ navigation }: any) {
  const [categories, setCategories] = useState<db.Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  
  // Edit states
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await db.fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCatName.trim()) {
      Alert.alert('Lỗi', 'Tên danh mục không được để trống.');
      return;
    }

    try {
      await db.addCategory(newCatName.trim());
      Alert.alert('Thành công', 'Đã thêm danh mục mới.');
      setNewCatName('');
      setShowAddForm(false);
      loadCategories();
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể thêm danh mục.');
    }
  };

  const handleUpdateCategory = async (id: number) => {
    if (!editName.trim()) {
      Alert.alert('Lỗi', 'Tên danh mục không được để trống.');
      return;
    }

    try {
      await db.updateCategory({ id, name: editName.trim() });
      Alert.alert('Thành công', 'Đã cập nhật danh mục.');
      setEditingCatId(null);
      setEditName('');
      loadCategories();
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể cập nhật danh mục.');
    }
  };

  const handleDeleteCategory = (id: number, name: string) => {
    Alert.alert(
      'Cảnh báo xóa',
      `Bạn có chắc chắn muốn xóa danh mục "${name}"? HÀNH ĐỘNG NÀY SẼ XÓA TOÀN BỘ SẢN PHẨM THUỘC DANH MỤC NÀY!`,
      [
        { text: 'Quay lại', style: 'cancel' },
        {
          text: 'Xóa tất cả',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.deleteCategory(id);
              Alert.alert('Thành công', 'Đã xóa danh mục và các sản phẩm đi kèm.');
              loadCategories();
            } catch (err) {
              Alert.alert('Lỗi', 'Không thể xóa danh mục lúc này.');
            }
          },
        },
      ]
    );
  };

  const renderCategoryItem = ({ item }: { item: db.Category }) => {
    const isEditing = editingCatId === item.id;

    return (
      <View style={styles.catCard}>
        {isEditing ? (
          <View style={styles.editRow}>
            <TextInput
              style={styles.editInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Nhập tên mới..."
            />
            <TouchableOpacity
              style={styles.saveBtnMini}
              onPress={() => handleUpdateCategory(item.id)}
            >
              <Ionicons name="checkmark" size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtnMini}
              onPress={() => {
                setEditingCatId(null);
                setEditName('');
              }}
            >
              <Ionicons name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.catName}>{item.name}</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionBtnEdit}
                onPress={() => {
                  setEditingCatId(item.id);
                  setEditName(item.name);
                }}
              >
                <Ionicons name="create-outline" size={16} color="#003d79" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtnDelete}
                onPress={() => handleDeleteCategory(item.id, item.name)}
              >
                <Ionicons name="trash-outline" size={16} color="#d9383a" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#003d79" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý danh mục</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Ionicons name={showAddForm ? 'close' : 'add-circle-outline'} size={22} color="#003d79" />
        </TouchableOpacity>
      </View>

      {/* ── ADD FORM ── */}
      {showAddForm && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Thêm danh mục mới</Text>
          <View style={styles.formInputRow}>
            <TextInput
              style={styles.input}
              placeholder="Tên danh mục..."
              value={newCatName}
              onChangeText={setNewCatName}
            />
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddCategory}>
              <Text style={styles.submitBtnText}>Thêm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#003d79" />
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    height: 50,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#003d79',
  },
  addBtn: {
    padding: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 12,
  },
  catCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
  },
  catName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtnEdit: {
    backgroundColor: '#e6f0fa',
    width: 32,
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnDelete: {
    backgroundColor: '#fee2e2',
    width: 32,
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editRow: {
    flexDirection: 'row',
    flex: 1,
    gap: 8,
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    height: 34,
    paddingHorizontal: 8,
    fontSize: 12,
    backgroundColor: '#fff',
  },
  saveBtnMini: {
    backgroundColor: '#16a34a',
    width: 32,
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnMini: {
    backgroundColor: '#64748b',
    width: 32,
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    gap: 8,
  },
  formTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#003d79',
  },
  formInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    height: 38,
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#1e293b',
  },
  submitBtn: {
    backgroundColor: '#003d79',
    width: 70,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});
