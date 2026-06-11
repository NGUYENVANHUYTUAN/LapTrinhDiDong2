import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {
  addCategory,
  addProduct,
  Category,
  deleteCategory,
  deleteProduct,
  fetchCategories,
  fetchProducts,
  initDatabase,
  Product,
  searchProductsByNameOrCategory,
  updateCategory,
  updateProduct,
} from './database';

type TabKey = 'products' | 'categories';

const SanphamSqlite = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('products');
  const [ready, setReady] = useState(false);

  // --- Sản phẩm ---
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [img, setImg] = useState('hinh1.jpg');
  const [searchQuery, setSearchQuery] = useState('');

  // --- Loại sản phẩm ---
  const [catName, setCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [selectedCatName, setSelectedCatName] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImg, setProdImg] = useState('hinh1.jpg');

  useEffect(() => {
    initDatabase(() => {
      setReady(true);
      loadData();
    });
  }, []);

  const loadData = async () => {
    const cats = await fetchCategories();
    const prods = await fetchProducts();
    setCategories(cats);
    setProducts(prods);
    if (cats.length > 0 && !cats.some((c) => c.id === categoryId)) {
      setCategoryId(cats[0].id);
    }
  };

  const loadCategories = async () => {
    const cats = await fetchCategories();
    setCategories(cats);
  };

  const getCategoryName = (id: number) =>
    categories.find((c) => c.id === id)?.name ?? '';

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      await loadData();
    } else {
      const results = await searchProductsByNameOrCategory(text.trim());
      setProducts(results);
    }
  };

  const getImageSource = (imagePath: string) => {
    if (
      imagePath?.startsWith('file://') ||
      imagePath?.startsWith('content://') ||
      imagePath?.startsWith('http')
    ) {
      return { uri: imagePath };
    }
    return null;
  };

  const resetProductForm = () => {
    setName('');
    setPrice('');
    setImg('hinh1.jpg');
    setCategoryId(categories[0]?.id ?? 1);
    setEditingId(null);
  };

  const handleSaveProduct = async () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tên và giá');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Lỗi', 'Giá sản phẩm không hợp lệ');
      return;
    }

    const isEdit = editingId !== null;
    const item = {
      name: name.trim(),
      price: priceNum,
      img: img.trim() || 'hinh1.jpg',
      categoryId,
    };

    try {
      if (isEdit && editingId) {
        await updateProduct({ ...item, id: editingId });
      } else {
        await addProduct(item);
      }
      resetProductForm();
      await loadData();
      Alert.alert('Thành công', isEdit ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm');
    } catch {
      Alert.alert('Lỗi', 'Không lưu được sản phẩm. Kiểm tra database.');
    }
  };

  const handleEditProduct = (item: Product) => {
    setEditingId(item.id);
    setName(item.name);
    setPrice(String(item.price));
    setCategoryId(item.categoryId);
    setImg(item.img || 'hinh1.jpg');
    setActiveTab('products');
  };

  const handleDeleteProduct = (id: number) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa sản phẩm này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProduct(id);
            if (editingId === id) resetProductForm();
            if (searchQuery.trim()) {
              await handleSearch(searchQuery);
            } else {
              await loadData();
            }
          } catch {
            Alert.alert('Lỗi', 'Không xóa được sản phẩm');
          }
        },
      },
    ]);
  };

  // --- CRUD Loại sản phẩm ---
  const handleSaveCategory = async () => {
    if (!catName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên loại sản phẩm');
      return;
    }

    try {
      if (editingCatId) {
        await updateCategory({ id: editingCatId, name: catName.trim() });
        setEditingCatId(null);
      } else {
        await addCategory(catName.trim());
      }
      setCatName('');
      await loadData();
      Alert.alert('Thành công', editingCatId ? 'Đã cập nhật loại' : 'Đã thêm loại mới');
    } catch {
      Alert.alert('Lỗi', 'Không lưu được loại sản phẩm');
    }
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCatId(cat.id);
    setCatName(cat.name);
  };

  const handleDeleteCategory = (id: number) => {
    Alert.alert(
      'Xác nhận',
      'Xóa loại sẽ xóa toàn bộ sản phẩm thuộc loại này. Bạn chắc chắn chứ?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(id);
              if (editingCatId === id) {
                setEditingCatId(null);
                setCatName('');
              }
              await loadData();
            } catch {
              Alert.alert('Lỗi', 'Không xóa được loại sản phẩm');
            }
          },
        },
      ]
    );
  };

  const openAddProductModal = (cat: Category) => {
    setSelectedCatId(cat.id);
    setSelectedCatName(cat.name);
    setProdName('');
    setProdPrice('');
    setProdImg('hinh1.jpg');
    setModalVisible(true);
  };

  const handleSaveProductForCategory = async () => {
    if (!prodName.trim() || !prodPrice.trim() || !selectedCatId) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin sản phẩm');
      return;
    }

    const priceNum = parseFloat(prodPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Lỗi', 'Giá sản phẩm không hợp lệ');
      return;
    }

    try {
      await addProduct({
        name: prodName.trim(),
        price: priceNum,
        img: prodImg.trim() || 'hinh1.jpg',
        categoryId: selectedCatId,
      });
      setModalVisible(false);
      await loadData();
      Alert.alert('Thành công', `Đã thêm sản phẩm cho loại "${selectedCatName}"`);
    } catch {
      Alert.alert('Lỗi', 'Không thêm được sản phẩm');
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const source = getImageSource(item.img);
    return (
      <View style={styles.card}>
        {source ? (
          <Image source={source} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.imagePlaceholderText}>📦</Text>
          </View>
        )}
        <View style={styles.cardInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price.toLocaleString('vi-VN')} đ</Text>
          <Text style={styles.productCategory}>{getCategoryName(item.categoryId)}</Text>
          <View style={styles.iconRow}>
            <TouchableOpacity onPress={() => handleEditProduct(item)}>
              <Text style={styles.icon}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteProduct(item.id)}>
              <Text style={styles.icon}>❌</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <View style={styles.catRow}>
      <View style={styles.catInfo}>
        <Text style={styles.catId}>#{item.id}</Text>
        <Text style={styles.catName}>{item.name}</Text>
      </View>
      <View style={styles.catActions}>
        <TouchableOpacity style={styles.btnAddProd} onPress={() => openAddProductModal(item)}>
          <Text style={styles.btnSmallText}>➕ SP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnEdit} onPress={() => handleEditCategory(item)}>
          <Text style={styles.btnSmallText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnDelete} onPress={() => handleDeleteCategory(item.id)}>
          <Text style={styles.btnSmallText}>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!ready) {
    return (
      <View style={styles.loading}>
        <Text>Đang khởi tạo database...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.screen}
    >
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'products' && styles.tabActive]}
          onPress={() => setActiveTab('products')}
        >
          <Text style={[styles.tabText, activeTab === 'products' && styles.tabTextActive]}>
            📦 Sản phẩm
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'categories' && styles.tabActive]}
          onPress={() => {
            setActiveTab('categories');
            loadCategories();
          }}
        >
          <Text style={[styles.tabText, activeTab === 'categories' && styles.tabTextActive]}>
            🏷️ Loại sản phẩm
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'products' ? (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderProductItem}
          contentContainerStyle={styles.container}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.title}>Quản lý sản phẩm</Text>

              <TextInput
                style={styles.input}
                placeholder="Tên sản phẩm"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Giá sản phẩm (VNĐ)"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
              <TextInput
                style={styles.input}
                placeholder="Tên ảnh (VD: hinh1.jpg hoặc đường dẫn file)"
                value={img}
                onChangeText={setImg}
              />

              <Text style={styles.label}>Loại sản phẩm:</Text>
              <RNPickerSelect
                onValueChange={(value) => value && setCategoryId(value)}
                items={categories.map((c) => ({ label: c.name, value: c.id }))}
                value={categoryId}
                style={{
                  inputAndroid: styles.pickerStyle,
                  inputIOS: styles.pickerStyle,
                }}
                placeholder={{ label: 'Chọn loại...', value: null }}
              />

              <TouchableOpacity style={styles.button} onPress={handleSaveProduct}>
                <Text style={styles.buttonText}>
                  {editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
                </Text>
              </TouchableOpacity>

              {editingId && (
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={resetProductForm}
                >
                  <Text style={styles.buttonText}>Hủy chỉnh sửa</Text>
                </TouchableOpacity>
              )}

              <TextInput
                style={[styles.input, styles.searchInput]}
                placeholder="🔍 Tìm theo tên sản phẩm hoặc loại"
                value={searchQuery}
                onChangeText={handleSearch}
              />

              <Text style={styles.listCount}>Danh sách: {products.length} sản phẩm</Text>
            </View>
          }
          ListEmptyComponent={<Text style={styles.empty}>Không có sản phẩm nào</Text>}
        />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderCategoryItem}
          contentContainerStyle={styles.container}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.title}>Quản lý loại sản phẩm</Text>
              <Text style={styles.subtitle}>Xem, thêm, sửa, xóa loại & thêm SP theo loại</Text>

              <View style={styles.catForm}>
                <TextInput
                  style={[styles.input, styles.catInput]}
                  placeholder="Tên loại sản phẩm..."
                  value={catName}
                  onChangeText={setCatName}
                />
                <TouchableOpacity style={styles.button} onPress={handleSaveCategory}>
                  <Text style={styles.buttonText}>
                    {editingCatId ? 'Cập nhật' : 'Thêm mới'}
                  </Text>
                </TouchableOpacity>
              </View>

              {editingCatId && (
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setEditingCatId(null);
                    setCatName('');
                  }}
                >
                  <Text style={styles.buttonText}>Hủy chỉnh sửa</Text>
                </TouchableOpacity>
              )}

              <Text style={styles.listCount}>Danh sách: {categories.length} loại</Text>
            </View>
          }
          ListEmptyComponent={<Text style={styles.empty}>Chưa có loại sản phẩm nào</Text>}
        />
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>📦 Thêm sản phẩm mới</Text>
            <Text style={styles.modalSub}>
              Loại: <Text style={styles.modalSubBold}>{selectedCatName}</Text>
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Tên sản phẩm"
              value={prodName}
              onChangeText={setProdName}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Giá bán (VNĐ)"
              keyboardType="numeric"
              value={prodPrice}
              onChangeText={setProdPrice}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Tên ảnh (hinh1.jpg)"
              value={prodImg}
              onChangeText={setProdImg}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmit} onPress={handleSaveProductForCategory}>
                <Text style={styles.modalSubmitText}>Lưu lại</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default SanphamSqlite;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f5f5f5' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: '#3498db' },
  tabText: { fontSize: 15, color: '#888', fontWeight: '600' },
  tabTextActive: { color: '#3498db' },
  container: { padding: 16, paddingBottom: 50 },
  header: { marginBottom: 20 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 16,
  },
  label: { fontSize: 14, color: '#666', marginBottom: 4, marginLeft: 2 },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  searchInput: { marginTop: 8 },
  catForm: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  catInput: { flex: 1, marginBottom: 0 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: { width: 90, height: 90 },
  imagePlaceholder: {
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: { fontSize: 32 },
  cardInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  productName: { fontWeight: 'bold', fontSize: 17, color: '#333' },
  productPrice: { color: '#e74c3c', marginTop: 4, fontSize: 15, fontWeight: '500' },
  productCategory: { color: '#666', marginTop: 2, fontSize: 13 },
  iconRow: { flexDirection: 'row', marginTop: 10, gap: 15 },
  icon: { fontSize: 22 },
  catRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  catInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  catId: { fontSize: 14, fontWeight: 'bold', color: '#aaa' },
  catName: { fontSize: 16, fontWeight: '600', color: '#333' },
  catActions: { flexDirection: 'row', gap: 8 },
  btnAddProd: {
    backgroundColor: '#27ae60',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  btnEdit: {
    backgroundColor: '#3498db',
    padding: 6,
    borderRadius: 6,
  },
  btnDelete: {
    backgroundColor: '#e74c3c',
    padding: 6,
    borderRadius: 6,
  },
  btnSmallText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  pickerStyle: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#000',
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  cancelButton: { backgroundColor: '#666' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  listCount: { fontSize: 14, color: '#555', marginTop: 8, marginBottom: 8 },
  empty: { textAlign: 'center', marginTop: 20, color: '#888' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  modalSub: { fontSize: 14, color: '#666', marginBottom: 20 },
  modalSubBold: { fontWeight: 'bold', color: '#3498db' },
  modalInput: {
    height: 46,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
    fontSize: 15,
    backgroundColor: '#fafafa',
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  modalCancel: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  modalCancelText: { color: '#666', fontWeight: '600' },
  modalSubmit: {
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalSubmitText: { color: '#fff', fontWeight: 'bold' },
});
