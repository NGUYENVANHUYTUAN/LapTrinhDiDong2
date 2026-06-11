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
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as db from '../../database/db';
import { getProductImageUrl } from '../HomeScreen';

const formatPrice = (value: number) => {
  return value.toLocaleString('vi-VN') + ' ₫';
};

export default function ProductManagement({ navigation }: any) {
  const [products, setProducts] = useState<db.Product[]>([]);
  const [categories, setCategories] = useState<db.Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilterCategoryId, setSelectedFilterCategoryId] = useState<number | null>(null);

  // Form states (Add/Edit)
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<db.Product | null>(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [img, setImg] = useState('camera_sony_a7iv.jpg');

  const filteredProducts = selectedFilterCategoryId === null
    ? products
    : products.filter(p => p.categoryId === selectedFilterCategoryId);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Quyền truy cập bị từ chối',
          'Bạn cần cấp quyền truy cập thư viện ảnh trong cài đặt thiết bị để chọn ảnh sản phẩm.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImg(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Lỗi khi chọn ảnh:', err);
      Alert.alert('Thất bại', 'Không thể chọn ảnh từ thư viện.');
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const prods = await db.fetchProducts();
      const cats = await db.fetchCategories();
      setProducts(prods);
      setCategories(cats);
      if (cats.length > 0) {
        setCategoryId(cats[0].id);
      }
    } catch (err) {
      console.error('Error loading product management data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenEdit = (prod: db.Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setPrice(prod.price.toString());
    setCategoryId(prod.categoryId);
    setImg(prod.img);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setName('');
    setPrice('');
    setImg('camera_sony_a7iv.jpg');
    if (categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  };

  const handleSaveProduct = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Tên sản phẩm không được để trống.');
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Lỗi', 'Giá sản phẩm phải là số lớn hơn 0.');
      return;
    }
    if (!categoryId) {
      Alert.alert('Lỗi', 'Vui lòng chọn danh mục cho sản phẩm.');
      return;
    }

    try {
      if (editingProduct) {
        // Update
        await db.updateProduct({
          id: editingProduct.id,
          name: name.trim(),
          price: priceNum,
          categoryId,
          img: img.trim(),
        });
        Alert.alert('Thành công', 'Đã cập nhật thông tin sản phẩm.');
      } else {
        // Create
        await db.addProduct({
          name: name.trim(),
          price: priceNum,
          categoryId,
          img: img.trim(),
        });
        Alert.alert('Thành công', 'Đã thêm sản phẩm mới.');
      }
      handleCloseForm();
      loadData();
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể lưu sản phẩm lúc này.');
    }
  };

  const handleDeleteProduct = (id: number, pName: string) => {
    Alert.alert(
      'Xóa sản phẩm',
      `Bạn chắc chắn muốn xóa sản phẩm "${pName}" khỏi hệ thống?`,
      [
        { text: 'Quay lại', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.deleteProduct(id);
              Alert.alert('Thành công', 'Đã xóa sản phẩm.');
              loadData();
            } catch (err) {
              Alert.alert('Lỗi', 'Không thể xóa sản phẩm.');
            }
          },
        },
      ]
    );
  };

  const renderProductItem = ({ item }: { item: db.Product }) => {
    const catName = categories.find(c => c.id === item.categoryId)?.name || 'Chưa phân loại';

    return (
      <View style={styles.prodCard}>
        <Image source={{ uri: getProductImageUrl(item.img) }} style={styles.prodImg} />
        
        <View style={styles.prodMeta}>
          <Text style={styles.prodName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.prodPrice}>{formatPrice(item.price)}</Text>
          <Text style={styles.prodCategory}>Danh mục: {catName}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtnEdit}
            onPress={() => handleOpenEdit(item)}
          >
            <Ionicons name="create-outline" size={16} color="#003d79" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtnDelete}
            onPress={() => handleDeleteProduct(item.id, item.name)}
          >
            <Ionicons name="trash-outline" size={16} color="#d9383a" />
          </TouchableOpacity>
        </View>
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
        <Text style={styles.headerTitle}>Quản lý sản phẩm</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowForm(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#003d79" />
        </TouchableOpacity>
      </View>

      {/* ── CATEGORY FILTER CHIPS ── */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilterCategoryId === null && styles.filterChipActive
            ]}
            onPress={() => setSelectedFilterCategoryId(null)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilterCategoryId === null && styles.filterChipTextActive
              ]}
            >
              Tất cả
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.filterChip,
                selectedFilterCategoryId === cat.id && styles.filterChipActive
              ]}
              onPress={() => setSelectedFilterCategoryId(cat.id)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilterCategoryId === cat.id && styles.filterChipTextActive
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── ADD / EDIT FORM MODAL ── */}
      <Modal
        visible={showForm}
        animationType="slide"
        onRequestClose={handleCloseForm}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={handleCloseForm}>
              <Ionicons name="close" size={24} color="#334155" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>
              {editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
            </Text>
            <TouchableOpacity style={styles.modalSaveHeaderBtn} onPress={handleSaveProduct}>
              <Text style={styles.modalSaveHeaderText}>Lưu</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalFormScroll} keyboardShouldPersistTaps="handled">
            <View style={styles.modalFormContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tên sản phẩm</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ví dụ: Sony Alpha A7R V"
                  placeholderTextColor="#94a3b8"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Giá bán (VNĐ)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ví dụ: 89000000"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Hình ảnh sản phẩm</Text>
                
                {/* Image Preview Container */}
                <View style={styles.imagePickerContainer}>
                  {img ? (
                    <View style={styles.previewWrapper}>
                      <Image source={{ uri: getProductImageUrl(img) }} style={styles.imagePreview} />
                      <TouchableOpacity style={styles.removeImgBtn} onPress={() => setImg('')}>
                        <Ionicons name="trash" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.placeholderWrapper} onPress={pickImage} activeOpacity={0.8}>
                      <Ionicons name="cloud-upload-outline" size={32} color="#94a3b8" />
                      <Text style={styles.placeholderText}>Tải ảnh từ điện thoại</Text>
                      <Text style={styles.placeholderSubtext}>Hỗ trợ các định dạng PNG, JPG, JPEG</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Pick Buttons */}
                <View style={styles.pickerActions}>
                  <TouchableOpacity style={styles.secondaryPickerBtn} onPress={pickImage} activeOpacity={0.8}>
                    <Ionicons name="image-outline" size={18} color="#003d79" />
                    <Text style={styles.secondaryPickerBtnText}>Chọn từ thư viện</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.secondaryPickerBtn} 
                    onPress={() => {
                      Alert.prompt(
                        'Nhập liên kết ảnh',
                        'Dán đường dẫn (URL) hình ảnh sản phẩm từ Internet hoặc tên file assets:',
                        [
                          { text: 'Hủy', style: 'cancel' },
                          { 
                            text: 'OK', 
                            onPress: (url) => {
                              if (url && url.trim()) setImg(url.trim());
                            } 
                          }
                        ],
                        'plain-text',
                        img.startsWith('http') || img.startsWith('file:') ? '' : img
                      );
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="link-outline" size={18} color="#003d79" />
                    <Text style={styles.secondaryPickerBtnText}>Nhập thủ công / URL</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Chọn danh mục sản phẩm</Text>
                <View style={styles.catSelectWrapper}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.catSelectBtn,
                        categoryId === cat.id && styles.catSelectBtnActive
                      ]}
                      onPress={() => setCategoryId(cat.id)}
                    >
                      <Text style={[
                        styles.catSelectText,
                        categoryId === cat.id && styles.catSelectTextActive
                      ]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleSaveProduct}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.modalSubmitBtnText}>
                  {editingProduct ? 'Cập nhật sản phẩm' : 'Lưu sản phẩm mới'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalCancelBtn} onPress={handleCloseForm}>
                <Text style={styles.modalCancelBtnText}>Hủy bỏ</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#003d79" />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
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
    backgroundColor: '#f8fafc',
  },
  header: {
    height: 55,
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
    fontSize: 16,
    fontWeight: '900',
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
  prodCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prodImg: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: '#f8fafc',
    resizeMode: 'contain',
  },
  prodMeta: {
    flex: 1,
    gap: 3,
  },
  prodName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: 16,
  },
  prodPrice: {
    fontSize: 12,
    fontWeight: '950',
    color: '#d9383a',
  },
  prodCategory: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    height: 55,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#003d79',
  },
  modalSaveHeaderBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#003d79',
  },
  modalSaveHeaderText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  modalFormScroll: {
    flex: 1,
  },
  modalFormContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    height: 40,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#1e293b',
    backgroundColor: '#fff',
  },
  catSelectWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  catSelectBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
  },
  catSelectBtnActive: {
    backgroundColor: '#003d79',
    borderColor: '#003d79',
  },
  catSelectText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '700',
  },
  catSelectTextActive: {
    color: '#fff',
  },
  modalSubmitBtn: {
    backgroundColor: '#003d79',
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    shadowColor: '#003d79',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  modalSubmitBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  modalCancelBtn: {
    backgroundColor: '#f1f5f9',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  modalCancelBtnText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
  imagePickerContainer: {
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  previewWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  removeImgBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(217, 56, 58, 0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  placeholderWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#003d79',
    marginTop: 8,
  },
  placeholderSubtext: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
  },
  pickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  secondaryPickerBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 38,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  secondaryPickerBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003d79',
  },
  filterContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 10,
  },
  filterScrollContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  filterChipActive: {
    backgroundColor: '#003d79',
    borderColor: '#003d79',
  },
  filterChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: '#fff',
  },
});
