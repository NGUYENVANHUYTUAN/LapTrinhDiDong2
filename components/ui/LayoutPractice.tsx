import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  TextInput,
  SafeAreaView,
  Dimensions,
  Platform,
  FlatList,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 1. Interface for Product representation in TypeScript
interface Product {
  id: number;
  name: string;
  price: number;
}

interface FlatListProduct {
  id: string;
  name: string;
  price: number;
  image: ImageSourcePropType;
  imageType: 'local' | 'remote';
}

// Interface for Render Logs
interface RenderLog {
  time: string;
  message: string;
  phase: 'Render' | 'Reconciliation' | 'Commit';
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 32 - 16) / 3;

const LayoutPractice = () => {
  // Navigation / Tabs state
  const [activeTab, setActiveTab] = useState<'render' | 'vertical' | 'horizontal' | 'full' | 'array' | 'flatlist'>('render');

  // --- TAB 6: FLATLIST & IMAGE STATE ---
  const [flatListProducts, setFlatListProducts] = useState<FlatListProduct[]>([
    {
      id: '1',
      name: 'React Logo Icon',
      price: 15,
      image: require('../../assets/images/react-logo.png'),
      imageType: 'local',
    },
    {
      id: '2',
      name: 'Expo Favicon',
      price: 5,
      image: require('../../assets/images/favicon.png'),
      imageType: 'local',
    },
    {
      id: '3',
      name: 'Wireless Headset',
      price: 99,
      image: { uri: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=60' },
      imageType: 'remote',
    },
    {
      id: '4',
      name: 'Smart Watch 9',
      price: 399,
      image: { uri: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=60' },
      imageType: 'remote',
    },
    {
      id: '5',
      name: 'Mechanical KB',
      price: 149,
      image: { uri: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&auto=format&fit=crop&q=60' },
      imageType: 'remote',
    },
    {
      id: '6',
      name: 'Developer Mug',
      price: 25,
      image: require('../../assets/images/icon.png'),
      imageType: 'local',
    },
  ]);

  const [selectedSourceType, setSelectedSourceType] = useState<'local' | 'remote'>('local');
  const [localAssetChoice, setLocalAssetChoice] = useState<'logo' | 'favicon' | 'icon'>('logo');
  const [remoteUrlChoice, setRemoteUrlChoice] = useState<'headset' | 'keyboard' | 'watch' | 'custom'>('headset');
  const [customUrl, setCustomUrl] = useState<string>('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=60');
  
  const [newFlatListProdName, setNewFlatListProdName] = useState<string>('');
  const [newFlatListProdPrice, setNewFlatListProdPrice] = useState<string>('');

  const getLocalPath = () => {
    switch (localAssetChoice) {
      case 'logo': return '../../assets/images/react-logo.png';
      case 'favicon': return '../../assets/images/favicon.png';
      case 'icon': return '../../assets/images/icon.png';
    }
  };

  const getLocalAssetSource = () => {
    switch (localAssetChoice) {
      case 'logo': return require('../../assets/images/react-logo.png');
      case 'favicon': return require('../../assets/images/favicon.png');
      case 'icon': return require('../../assets/images/icon.png');
    }
  };

  const getLocalAssetValue = () => {
    try {
      const source = getLocalAssetSource();
      return typeof source === 'number' ? source : 'Object';
    } catch {
      return 'Unknown';
    }
  };

  const getCurrentImageSource = () => {
    if (selectedSourceType === 'local') {
      return getLocalAssetSource();
    } else {
      return { uri: customUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=60' };
    }
  };

  const handleFlatListAdd = () => {
    if (!newFlatListProdName.trim() || !newFlatListProdPrice.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên và giá sản phẩm!');
      return;
    }
    const priceNum = parseFloat(newFlatListProdPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Lỗi', 'Giá sản phẩm phải lớn hơn 0!');
      return;
    }

    const newProd: FlatListProduct = {
      id: Date.now().toString(),
      name: newFlatListProdName.trim(),
      price: priceNum,
      image: getCurrentImageSource(),
      imageType: selectedSourceType,
    };

    setFlatListProducts(prev => [...prev, newProd]);
    setNewFlatListProdName('');
    setNewFlatListProdPrice('');
    Alert.alert('Thành công', `Đã thêm "${newProd.name}" vào FlatList!`);
  };

  const handleFlatListDelete = (id: string) => {
    setFlatListProducts(prev => prev.filter(p => p.id !== id));
  };

  // --- TAB 1: RENDER DEMO STATE ---
  const [count, setCount] = useState<number>(0);
  const [renderLogs, setRenderLogs] = useState<RenderLog[]>([
    { time: new Date().toLocaleTimeString(), message: 'Khởi chạy: Component render lần đầu tiên.', phase: 'Render' },
  ]);

  const handleIncrement = () => {
    const nextCount = count + 1;
    const timeStr = new Date().toLocaleTimeString();
    
    // Add logs reflecting RN render process steps
    const newLogs: RenderLog[] = [
      { time: timeStr, message: `Giai đoạn 1 (Render): State count thay đổi (${count} -> ${nextCount}). Virtual DOM mới được khởi tạo.`, phase: 'Render' },
      { time: timeStr, message: `Giai đoạn 2 (Reconciliation): React so sánh cây Virtual DOM mới với cây cũ để tìm điểm khác biệt.`, phase: 'Reconciliation' },
      { time: timeStr, message: `Giai đoạn 3 (Commit): Chỉ cập nhật Text chứa số ${nextCount} trên Native UI.`, phase: 'Commit' },
    ];

    setCount(nextCount);
    setRenderLogs(prev => [...newLogs, ...prev]);
  };

  const handleClearLogs = () => {
    setRenderLogs([{ time: new Date().toLocaleTimeString(), message: 'Đã xóa log. Sẵn sàng ghi log mới.', phase: 'Render' }]);
  };

  // --- TAB 5: TS ARRAY & STATE PLAYGROUND ---
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'iPhone 15 Pro Max', price: 1199 },
    { id: 2, name: 'Samsung Galaxy S24 Ultra', price: 1099 },
    { id: 3, name: 'MacBook Pro M3 Max', price: 2499 },
    { id: 4, name: 'iPad Pro M4', price: 999 },
  ]);
  const [newProductName, setNewProductName] = useState<string>('');
  const [newProductPrice, setNewProductPrice] = useState<string>('');
  const [arrayMethodUsed, setArrayMethodUsed] = useState<string>('Khởi tạo ban đầu');

  // Immutable addition: spread operator
  const handleAddProduct = () => {
    if (!newProductName.trim() || !newProductPrice.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên và giá sản phẩm!');
      return;
    }
    const priceNum = parseFloat(newProductPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Lỗi', 'Giá sản phẩm phải là một số lớn hơn 0!');
      return;
    }

    const newProd: Product = {
      id: Date.now(),
      name: newProductName.trim(),
      price: priceNum,
    };

    setProducts(prev => [...prev, newProd]);
    setNewProductName('');
    setNewProductPrice('');
    setArrayMethodUsed(`setProducts(prev => [...prev, newItem]);\n// Thêm: "${newProd.name}"`);
  };

  // Immutable deletion: filter
  const handleDeleteProduct = (id: number) => {
    const itemToDelete = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    setArrayMethodUsed(`setProducts(prev => prev.filter(item => item.id !== ${id}));\n// Xóa: "${itemToDelete?.name || 'Sản phẩm'}"`);
  };

  // Immutable sort: sort spread array
  const handleSortProducts = () => {
    setProducts(prev => [...prev].sort((a, b) => a.price - b.price));
    setArrayMethodUsed(`setProducts(prev => [...prev].sort((a, b) => a.price - b.price));\n// Sắp xếp tăng dần theo giá`);
  };

  // Immutable reverse: reverse spread array
  const handleReverseProducts = () => {
    setProducts(prev => [...prev].reverse());
    setArrayMethodUsed(`setProducts(prev => [...prev].reverse());\n// Đảo ngược thứ tự các phần tử`);
  };

  // Reset to original list
  const handleResetProducts = () => {
    setProducts([
      { id: 1, name: 'iPhone 15 Pro Max', price: 1199 },
      { id: 2, name: 'Samsung Galaxy S24 Ultra', price: 1099 },
      { id: 3, name: 'MacBook Pro M3 Max', price: 2499 },
      { id: 4, name: 'iPad Pro M4', price: 999 },
    ]);
    setArrayMethodUsed(`setProducts(initialArray);\n// Đặt lại danh sách mặc định`);
  };

  // Calculate sum using reduce
  const totalSum = products.reduce((acc, curr) => acc + curr.price, 0);

  // Show privacy policy
  // FlatList Render Helpers
  const renderFlatListItem = ({ item, index }: { item: FlatListProduct; index: number }) => {
    return (
      <View style={styles.flatListCard}>
        <View style={styles.flatListImageWrapper}>
          <Image
            source={item.image}
            style={styles.flatListImage}
            resizeMode="cover"
          />
          <View style={styles.flatListIndexBadge}>
            <Text style={styles.flatListIndexText}>#{index}</Text>
          </View>
        </View>

        <Text style={styles.flatListCardName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.flatListCardPrice}>${item.price}</Text>

        <TouchableOpacity
          style={styles.flatListDeleteBtn}
          onPress={() => handleFlatListDelete(item.id)}
        >
          <Ionicons name="trash" size={10} color="#fff" />
          <Text style={styles.flatListDeleteBtnText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFlatListEmpty = () => (
    <View style={styles.flatListEmptyState}>
      <Ionicons name="file-tray-outline" size={48} color="#cbd5e1" />
      <Text style={styles.flatListEmptyText}>Không có sản phẩm nào. Hãy cấu hình và thêm sản phẩm ở trên!</Text>
    </View>
  );

  const renderFlatListHeader = () => {
    return (
      <View style={styles.flatListHeaderContainer}>
        {/* Theory Card */}
        <View style={styles.flatListTheoryCard}>
          <Text style={styles.theoryHeading}>📚 LÝ THUYẾT & ỨNG DỤNG THỰC TẾ</Text>
          <Text style={styles.theoryBody}>
            <Text style={{ fontWeight: 'bold', color: '#60a5fa' }}>FlatList:</Text> Tự động duyệt qua mảng <Text style={{ fontFamily: 'monospace', color: '#f472b6' }}>data</Text>, chỉ render các phần tử hiển thị. Mỗi phần tử gọi <Text style={{ fontFamily: 'monospace', color: '#f472b6' }}>renderItem({"{"} item, index {"}"})</Text> cho phép lấy vị trí <Text style={{ fontFamily: 'monospace', color: '#f472b6' }}>index</Text> của phần tử.
          </Text>
          <Text style={[styles.theoryBody, { marginTop: 6 }]}>
            <Text style={{ fontWeight: 'bold', color: '#34d399' }}>Image Source:</Text> Nhận một <Text style={{ color: '#fb7185' }}>number (ID nội bộ)</Text> cho ảnh local dùng <Text style={{ fontFamily: 'monospace', color: '#fb7185' }}>require()</Text>, hoặc một <Text style={{ color: '#fb7185' }}>object</Text> có thuộc tính <Text style={{ fontFamily: 'monospace', color: '#fb7185' }}>uri</Text> cho ảnh remote.
          </Text>
        </View>

        {/* Source Type Detector */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🖼️ Image Source & Prop Type Detector</Text>
          
          <View style={styles.sourceTypeToggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, selectedSourceType === 'local' && styles.toggleBtnActive]}
              onPress={() => setSelectedSourceType('local')}
            >
              <Text style={[styles.toggleBtnText, selectedSourceType === 'local' && styles.toggleBtnTextActive]}>
                Ảnh Cục Bộ (Local)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, selectedSourceType === 'remote' && styles.toggleBtnActive]}
              onPress={() => setSelectedSourceType('remote')}
            >
              <Text style={[styles.toggleBtnText, selectedSourceType === 'remote' && styles.toggleBtnTextActive]}>
                Ảnh Internet (Remote)
              </Text>
            </TouchableOpacity>
          </View>

          {selectedSourceType === 'local' ? (
            <View style={styles.assetSelectorContainer}>
              <Text style={styles.subLabel}>Chọn file ảnh cục bộ:</Text>
              <View style={styles.assetOptionRow}>
                <TouchableOpacity
                  style={[styles.assetOption, localAssetChoice === 'logo' && styles.assetOptionActive]}
                  onPress={() => setLocalAssetChoice('logo')}
                >
                  <Text style={styles.assetOptionText}>React Logo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.assetOption, localAssetChoice === 'favicon' && styles.assetOptionActive]}
                  onPress={() => setLocalAssetChoice('favicon')}
                >
                  <Text style={styles.assetOptionText}>Favicon</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.assetOption, localAssetChoice === 'icon' && styles.assetOptionActive]}
                  onPress={() => setLocalAssetChoice('icon')}
                >
                  <Text style={styles.assetOptionText}>Main Icon</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.urlInputContainer}>
              <Text style={styles.subLabel}>Chọn preset hoặc nhập URL:</Text>
              <View style={styles.presetUrlsRow}>
                <TouchableOpacity
                  style={[styles.presetUrlBtn, remoteUrlChoice === 'headset' && styles.presetUrlBtnActive]}
                  onPress={() => {
                    setRemoteUrlChoice('headset');
                    setCustomUrl('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=60');
                  }}
                >
                  <Text style={styles.presetUrlText}>Tai nghe</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.presetUrlBtn, remoteUrlChoice === 'keyboard' && styles.presetUrlBtnActive]}
                  onPress={() => {
                    setRemoteUrlChoice('keyboard');
                    setCustomUrl('https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&auto=format&fit=crop&q=60');
                  }}
                >
                  <Text style={styles.presetUrlText}>Bàn phím</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.presetUrlBtn, remoteUrlChoice === 'watch' && styles.presetUrlBtnActive]}
                  onPress={() => {
                    setRemoteUrlChoice('watch');
                    setCustomUrl('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=60');
                  }}
                >
                  <Text style={styles.presetUrlText}>Đồng hồ</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.urlTextInput}
                value={customUrl}
                onChangeText={(txt) => {
                  setCustomUrl(txt);
                  setRemoteUrlChoice('custom');
                }}
                placeholder="https://example.com/image.jpg"
                placeholderTextColor="#94a3b8"
              />
            </View>
          )}

          <View style={styles.detectorOutputBox}>
            <View style={styles.detectorRow}>
              <Text style={styles.detectorLabel}>Kiểu source:</Text>
              <Text style={styles.detectorValueType}>
                {selectedSourceType === 'local' ? 'number (Resource ID)' : 'object ({ uri })'}
              </Text>
            </View>
            <View style={[styles.detectorRow, { marginTop: 6 }]}>
              <Text style={styles.detectorLabel}>Giá trị:</Text>
              <Text style={styles.detectorValueContent} numberOfLines={2}>
                {selectedSourceType === 'local'
                  ? `require('${getLocalPath()}') -> ID: ${getLocalAssetValue()}`
                  : JSON.stringify({ uri: customUrl })}
              </Text>
            </View>

            <View style={styles.previewSection}>
              <Text style={styles.previewLabel}>Xem trước ảnh:</Text>
              <View style={styles.previewImageContainer}>
                <Image
                  source={getCurrentImageSource()}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Add Product Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>➕ Thêm Sản Phẩm Mới Vào FlatList</Text>
          <Text style={styles.cardInfo}>Sản phẩm mới sẽ sử dụng ảnh được chọn ở Detector phía trên.</Text>
          
          <View style={styles.formRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.inputLabel}>Tên sản phẩm:</Text>
              <TextInput
                style={styles.flatListInput}
                value={newFlatListProdName}
                onChangeText={setNewFlatListProdName}
                placeholder="Ví dụ: Logitech G502..."
                placeholderTextColor="#94a3b8"
              />
            </View>
            <View style={{ width: 80 }}>
              <Text style={styles.inputLabel}>Giá ($):</Text>
              <TextInput
                style={styles.flatListInput}
                value={newFlatListProdPrice}
                onChangeText={setNewFlatListProdPrice}
                placeholder="59"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.flatListAddBtn} onPress={handleFlatListAdd}>
            <Ionicons name="add-circle" size={18} color="#fff" />
            <Text style={styles.btnText}>Thêm vào FlatList Grid</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.listHeading}>📦 Danh sách sản phẩm (FlatList Grid - 3 Cột)</Text>
      </View>
    );
  };

  const renderFlatListFooter = () => {
    const total = flatListProducts.reduce((acc, curr) => acc + curr.price, 0);
    return (
      <View style={styles.flatListFooterContainer}>
        <View style={styles.flatListTotalRow}>
          <Text style={styles.flatListTotalLabel}>Tổng Giá Trị (reduce):</Text>
          <Text style={styles.flatListTotalValue}>${total.toLocaleString()}</Text>
        </View>

        <View style={[styles.card, { marginTop: 16 }]}>
          <Text style={styles.cardTitle}>💡 Ghi nhớ quy tắc quan trọng:</Text>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletIcon}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={{ fontWeight: 'bold', color: '#fff' }}>Image source</Text> không nhận string trực tiếp. Tránh viết <Text style={{ color: '#ef4444' }}>source="https://..."</Text>.
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletIcon}>•</Text>
            <Text style={styles.bulletText}>
              Ảnh cục bộ phải dùng <Text style={{ fontFamily: 'monospace', color: '#fb7185' }}>require('static_path')</Text> để Bundler gán ID dạng <Text style={{ fontWeight: 'bold', color: '#10b981' }}>number</Text> lúc build.
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletIcon}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={{ fontWeight: 'bold', color: '#fff' }}>renderItem</Text> của FlatList nhận tham số là một object chứa các thuộc tính <Text style={{ color: '#38bdf8' }}>item</Text> (phần tử hiện tại) và <Text style={{ color: '#38bdf8' }}>index</Text> (vị trí hiện tại).
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Chính sách bảo mật',
      'Ứng dụng này cam kết bảo vệ dữ liệu cá nhân của người dùng. Mọi thông tin thu thập đều được mã hóa và không chia sẻ cho bên thứ ba khi chưa được sự đồng ý.',
      [{ text: 'Đã hiểu', style: 'cancel' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* App Main Header */}
      <View style={styles.appHeader}>
        <Text style={styles.appTitle}>Thực Hành React Native</Text>
        <Text style={styles.appSubtitle}>Layout & Cơ Chế Render & Mảng</Text>
      </View>

      {/* Tabs Menu Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'render' && styles.activeTabButton]}
            onPress={() => setActiveTab('render')}
          >
            <Ionicons name="hardware-chip-outline" size={16} color={activeTab === 'render' ? '#fff' : '#94a3b8'} />
            <Text style={[styles.tabText, activeTab === 'render' && styles.activeTabText]}>Cơ Chế Render</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'vertical' && styles.activeTabButton]}
            onPress={() => setActiveTab('vertical')}
          >
            <Ionicons name="swap-vertical-outline" size={16} color={activeTab === 'vertical' ? '#fff' : '#94a3b8'} />
            <Text style={[styles.tabText, activeTab === 'vertical' && styles.activeTabText]}>Layout Dọc</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'horizontal' && styles.activeTabButton]}
            onPress={() => setActiveTab('horizontal')}
          >
            <Ionicons name="swap-horizontal-outline" size={16} color={activeTab === 'horizontal' ? '#fff' : '#94a3b8'} />
            <Text style={[styles.tabText, activeTab === 'horizontal' && styles.activeTabText]}>Layout Ngang</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'full' && styles.activeTabButton]}
            onPress={() => setActiveTab('full')}
          >
            <Ionicons name="grid-outline" size={16} color={activeTab === 'full' ? '#fff' : '#94a3b8'} />
            <Text style={[styles.tabText, activeTab === 'full' && styles.activeTabText]}>Layout Web (Full)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'array' && styles.activeTabButton]}
            onPress={() => setActiveTab('array')}
          >
            <Ionicons name="code-slash-outline" size={16} color={activeTab === 'array' ? '#fff' : '#94a3b8'} />
            <Text style={[styles.tabText, activeTab === 'array' && styles.activeTabText]}>Mảng & State</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'flatlist' && styles.activeTabButton]}
            onPress={() => setActiveTab('flatlist')}
          >
            <Ionicons name="list-outline" size={16} color={activeTab === 'flatlist' ? '#fff' : '#94a3b8'} />
            <Text style={[styles.tabText, activeTab === 'flatlist' && styles.activeTabText]}>FlatList & Image</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Main Content Area */}
      <View style={styles.contentBody}>
        {/* TAB 1: RENDER MECHANISM */}
        {activeTab === 'render' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🔄 3 Giai Đoạn Render Trong React Native</Text>
              
              <View style={styles.theoryStep}>
                <Text style={styles.stepNum}>1</Text>
                <View style={styles.stepTextContainer}>
                  <Text style={styles.stepTitle}>Khởi tạo (Render Phase)</Text>
                  <Text style={styles.stepDesc}>Khi state/props thay đổi, React chạy component và vẽ lại cây Virtual DOM ảo (cấu trúc JSX mới).</Text>
                </View>
              </View>

              <View style={styles.theoryStep}>
                <Text style={styles.stepNum}>2</Text>
                <View style={styles.stepTextContainer}>
                  <Text style={styles.stepTitle}>Đối chiếu (Reconciliation Phase)</Text>
                  <Text style={styles.stepDesc}>Thuật toán Diffing so sánh Virtual DOM mới với cái cũ để tìm các nút bị thay đổi.</Text>
                </View>
              </View>

              <View style={styles.theoryStep}>
                <Text style={styles.stepNum}>3</Text>
                <View style={styles.stepTextContainer}>
                  <Text style={styles.stepTitle}>Đồng bộ (Commit Phase / Paint)</Text>
                  <Text style={styles.stepDesc}>React Native gửi các lệnh qua bridge để UI Thread của Native (iOS/Android) vẽ lại đúng vị trí thay đổi.</Text>
                </View>
              </View>
            </View>

            {/* Interactive Demo */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🧪 Demo Thực Tế</Text>
              <Text style={styles.cardInfo}>Nhấn nút tăng để kích hoạt re-render. Log quá trình hoạt động sẽ hiển thị bên dưới.</Text>
              
              <View style={styles.counterContainer}>
                <Text style={styles.counterLabel}>Giá trị State Hiện Tại:</Text>
                <Text style={styles.counterValue}>{count}</Text>
                <TouchableOpacity style={styles.btnPrimary} onPress={handleIncrement}>
                  <Ionicons name="add-circle-outline" size={20} color="#fff" />
                  <Text style={styles.btnText}>Tăng Count (+1)</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.logHeader}>
                <Text style={styles.logTitle}>📋 Log Trực Quan:</Text>
                <TouchableOpacity onPress={handleClearLogs}>
                  <Text style={styles.clearLogText}>Xóa logs</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.logBox}>
                {renderLogs.map((log, idx) => (
                  <View key={idx} style={styles.logLine}>
                    <Text style={styles.logTime}>[{log.time}]</Text>
                    <Text style={[
                      styles.logTag,
                      log.phase === 'Render' && styles.tagRender,
                      log.phase === 'Reconciliation' && styles.tagRecon,
                      log.phase === 'Commit' && styles.tagCommit,
                    ]}>
                      {log.phase}
                    </Text>
                    <Text style={styles.logMessage}>{log.message}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        )}

        {/* TAB 2: VERTICAL LAYOUT (3 equal regions in default direction) */}
        {activeTab === 'vertical' && (
          <View style={styles.fullFlexContainer}>
            <View style={styles.infoFloatingBanner}>
              <Text style={styles.infoFloatingText}>↕️ Hướng mặc định (flexDirection: 'column') - 3 vùng bằng nhau</Text>
            </View>
            <View style={[styles.verticalBox, { backgroundColor: '#f43f5e' }]}>
              <Ionicons name="cube" size={32} color="#fff" />
              <Text style={styles.verticalBoxText}>Vùng 1 (flex: 1)</Text>
              <Text style={styles.verticalBoxSub}>Chiều cao bằng 1/3 màn hình</Text>
            </View>
            <View style={[styles.verticalBox, { backgroundColor: '#10b981' }]}>
              <Ionicons name="server" size={32} color="#fff" />
              <Text style={styles.verticalBoxText}>Vùng 2 (flex: 1)</Text>
              <Text style={styles.verticalBoxSub}>Bố trí ở chính giữa</Text>
            </View>
            <View style={[styles.verticalBox, { backgroundColor: '#3b82f6' }]}>
              <Ionicons name="layers" size={32} color="#fff" />
              <Text style={styles.verticalBoxText}>Vùng 3 (flex: 1)</Text>
              <Text style={styles.verticalBoxSub}>Chiếm 1/3 phần cuối cùng</Text>
            </View>
          </View>
        )}

        {/* TAB 3: HORIZONTAL LAYOUT (3 equal regions in row direction) */}
        {activeTab === 'horizontal' && (
          <View style={styles.fullFlexContainer}>
            <View style={styles.infoFloatingBanner}>
              <Text style={styles.infoFloatingText}>↔️ Hướng ngang (flexDirection: 'row') - 3 vùng bằng nhau</Text>
            </View>
            <View style={styles.horizontalRowWrapper}>
              <View style={[styles.horizontalBox, { backgroundColor: '#fb7185' }]}>
                <Ionicons name="pie-chart" size={28} color="#fff" />
                <Text style={styles.horizontalBoxText}>Vùng 1</Text>
                <Text style={styles.horizontalBoxSub}>flex: 1</Text>
              </View>
              <View style={[styles.horizontalBox, { backgroundColor: '#34d399' }]}>
                <Ionicons name="analytics" size={28} color="#fff" />
                <Text style={styles.horizontalBoxText}>Vùng 2</Text>
                <Text style={styles.horizontalBoxSub}>flex: 1</Text>
              </View>
              <View style={[styles.horizontalBox, { backgroundColor: '#60a5fa' }]}>
                <Ionicons name="bar-chart" size={28} color="#fff" />
                <Text style={styles.horizontalBoxText}>Vùng 3</Text>
                <Text style={styles.horizontalBoxSub}>flex: 1</Text>
              </View>
            </View>
          </View>
        )}

        {/* TAB 4: WEB FULL LAYOUT (Header with logo & banner, Body with sidebar & content, Footer) */}
        {activeTab === 'full' && (
          <View style={styles.fullFlexContainer}>
            {/* Header: Logo và Banner */}
            <View style={styles.webHeader}>
              {/* Logo Area */}
              <View style={styles.webLogoArea}>
                <Image
                  source={require('../../assets/images/react-logo.png')}
                  style={styles.webLogo}
                  resizeMode="contain"
                  defaultSource={require('../../assets/images/favicon.png')}
                />
                <Text style={styles.webLogoText}>React Native</Text>
              </View>

              {/* Banner Area */}
              <View style={styles.webBannerArea}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60' }}
                  style={styles.webBannerBg}
                />
                <View style={styles.webBannerOverlay}>
                  <Text style={styles.webBannerTitle}>CƠ HỘI NGHỀ NGHIỆP</Text>
                  <Text style={styles.webBannerSub}>Khóa học lập trình di động 2026</Text>
                </View>
              </View>
            </View>

            {/* Body: Sidebar & Content */}
            <View style={styles.webBody}>
              {/* Sidebar (Trái) */}
              <View style={styles.webSidebar}>
                <TouchableOpacity style={styles.sidebarItem}>
                  <Ionicons name="home-outline" size={20} color="#64748b" />
                  <Text style={styles.sidebarText}>Trang Chủ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.sidebarItem, styles.sidebarItemActive]}>
                  <Ionicons name="cube-outline" size={20} color="#3b82f6" />
                  <Text style={[styles.sidebarText, styles.sidebarTextActive]}>Sản Phẩm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem}>
                  <Ionicons name="newspaper-outline" size={20} color="#64748b" />
                  <Text style={styles.sidebarText}>Tin Tức</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem}>
                  <Ionicons name="mail-outline" size={20} color="#64748b" />
                  <Text style={styles.sidebarText}>Liên Hệ</Text>
                </TouchableOpacity>
              </View>

              {/* Content (Phải) */}
              <ScrollView contentContainerStyle={styles.webContentContainer}>
                <Text style={styles.contentHeader}>Chào Mừng Đến Với Kho Sản Phẩm</Text>
                <Text style={styles.contentParagraph}>
                  Dưới đây là sơ đồ layout hoàn chỉnh được dựng bằng Flexbox trong React Native. Phần Sidebar chiếm độ rộng cố định nhỏ, trong khi Content sử dụng flex: 1 để tự động lấp đầy phần diện tích còn lại của màn hình.
                </Text>

                {/* Grid card items */}
                <View style={styles.gridContainer}>
                  <View style={styles.gridCard}>
                    <Ionicons name="color-palette-outline" size={24} color="#f43f5e" />
                    <Text style={styles.cardHeading}>Premium UI</Text>
                    <Text style={styles.cardBody}>Giao diện được tinh chỉnh với các mã màu HSL tuyệt đẹp.</Text>
                  </View>
                  <View style={styles.gridCard}>
                    <Ionicons name="phone-portrait-outline" size={24} color="#3b82f6" />
                    <Text style={styles.cardHeading}>Mượt Mà</Text>
                    <Text style={styles.cardBody}>Hiệu suất tối ưu hóa trên mọi thiết bị di động.</Text>
                  </View>
                </View>
              </ScrollView>
            </View>

            {/* Footer: Chính sách bảo mật & Các icon MXH */}
            <View style={styles.webFooter}>
              <TouchableOpacity onPress={handlePrivacyPolicy}>
                <Text style={styles.footerLink}>Chính sách bảo mật</Text>
              </TouchableOpacity>

              {/* Social icons row */}
              <View style={styles.socialIconsRow}>
                <TouchableOpacity style={styles.socialIcon}>
                  <Ionicons name="logo-facebook" size={20} color="#1877f2" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon}>
                  <Ionicons name="logo-youtube" size={20} color="#ff0000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon}>
                  <Ionicons name="logo-github" size={20} color="#000000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon}>
                  <Ionicons name="logo-twitter" size={20} color="#1da1f2" />
                </TouchableOpacity>
              </View>

              <Text style={styles.footerCopyright}>© 2026 Nguyễn Văn Huy Tuấn. All rights reserved.</Text>
            </View>
          </View>
        )}

        {/* TAB 5: TS ARRAY & REACT STATE PLAYGROUND */}
        {activeTab === 'array' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Array State Playground */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📦 Quản Lý Mảng Trong React State</Text>
              <Text style={styles.cardInfo}>
                Thêm, xóa và biến đổi danh sách sản phẩm bằng các phương thức bất biến (Immutable) của JavaScript/TypeScript.
              </Text>

              {/* Add form */}
              <View style={styles.formContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Tên sản phẩm..."
                  placeholderTextColor="#94a3b8"
                  value={newProductName}
                  onChangeText={setNewProductName}
                />
                <TextInput
                  style={[styles.input, { width: 100 }]}
                  placeholder="Giá ($)..."
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={newProductPrice}
                  onChangeText={setNewProductPrice}
                />
                <TouchableOpacity style={styles.btnSmall} onPress={handleAddProduct}>
                  <Ionicons name="add" size={20} color="#fff" />
                  <Text style={styles.btnText}>Thêm</Text>
                </TouchableOpacity>
              </View>

              {/* Action operations row */}
              <View style={styles.operationsRow}>
                <TouchableOpacity style={styles.btnOutline} onPress={handleSortProducts}>
                  <Ionicons name="trending-up-outline" size={14} color="#3b82f6" />
                  <Text style={styles.btnOutlineText}>Sắp xếp</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnOutline} onPress={handleReverseProducts}>
                  <Ionicons name="refresh-outline" size={14} color="#3b82f6" />
                  <Text style={styles.btnOutlineText}>Đảo ngược</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnOutline} onPress={handleResetProducts}>
                  <Ionicons name="sync-outline" size={14} color="#ef4444" />
                  <Text style={[styles.btnOutlineText, { color: '#ef4444' }]}>Đặt lại</Text>
                </TouchableOpacity>
              </View>

              {/* List of products */}
              <View style={styles.listContainer}>
                {products.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="file-tray-outline" size={40} color="#cbd5e1" />
                    <Text style={styles.emptyText}>Danh sách mảng hiện đang trống.</Text>
                  </View>
                ) : (
                  products.map((item) => (
                    <View key={item.id} style={styles.listItem}>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemPrice}>${item.price.toLocaleString()}</Text>
                      </View>
                      <TouchableOpacity style={styles.btnDelete} onPress={() => handleDeleteProduct(item.id)}>
                        <Ionicons name="trash-outline" size={18} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>

              {/* Reduce Total display */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng Giá Trị (reduce):</Text>
                <Text style={styles.totalValue}>${totalSum.toLocaleString()}</Text>
              </View>

              {/* Code visual feedback */}
              <View style={styles.codeFeedbackCard}>
                <Text style={styles.codeFeedbackHeader}>⚡ Code phương thức mảng vừa chạy:</Text>
                <Text style={styles.codeFeedbackText}>{arrayMethodUsed}</Text>
              </View>
            </View>

            {/* Explanatory Methods Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📚 Ghi Nhớ Quy Tắc Bất Biến (Immutability)</Text>
              
              <View style={styles.ruleBox}>
                <Text style={styles.ruleTitle}>❌ KHÔNG sử dụng trực tiếp:</Text>
                <Text style={styles.ruleDesc}>push(), pop(), splice(), shift() trực tiếp trên biến state gốc (ví dụ: products.push(x)) vì React sẽ không nhận diện được thay đổi để re-render.</Text>
              </View>

              <View style={[styles.ruleBox, styles.ruleBoxGreen]}>
                <Text style={[styles.ruleTitle, { color: '#0f766e' }]}>✅ NÊN sử dụng:</Text>
                <Text style={[styles.ruleDesc, { color: '#0f766e' }]}>map(), filter(), và toán tử spread [...] để sao chép mảng mới trước khi cập nhật state.</Text>
              </View>
            </View>
          </ScrollView>
        )}

        {activeTab === 'flatlist' && (
          <FlatList
            data={flatListProducts}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={styles.flatListColumnWrapper}
            contentContainerStyle={styles.flatListContent}
            ListHeaderComponent={renderFlatListHeader}
            ListFooterComponent={renderFlatListFooter}
            ListEmptyComponent={renderFlatListEmpty}
            renderItem={renderFlatListItem}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default LayoutPractice;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  appHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#0f172a',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  appSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  tabContainer: {
    backgroundColor: '#1e293b',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  tabScroll: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#0f172a',
  },
  activeTabButton: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#fff',
  },
  contentBody: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  cardInfo: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
    marginBottom: 16,
  },
  theoryStep: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepNum: {
    backgroundColor: '#2563eb',
    color: '#fff',
    width: 26,
    height: 26,
    borderRadius: 13,
    textAlign: 'center',
    lineHeight: 26,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 12,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f8fafc',
  },
  stepDesc: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    lineHeight: 16,
  },
  counterContainer: {
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  counterLabel: {
    fontSize: 13,
    color: '#94a3b8',
  },
  counterValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginVertical: 10,
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logTitle: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  clearLogText: {
    color: '#f43f5e',
    fontSize: 12,
  },
  logBox: {
    backgroundColor: '#020617',
    borderRadius: 12,
    padding: 12,
    maxHeight: 250,
  },
  logLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  logTime: {
    color: '#64748b',
    fontSize: 11,
    marginRight: 6,
  },
  logTag: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginRight: 6,
    overflow: 'hidden',
  },
  tagRender: {
    backgroundColor: '#8b5cf6',
  },
  tagRecon: {
    backgroundColor: '#f59e0b',
  },
  tagCommit: {
    backgroundColor: '#10b981',
  },
  logMessage: {
    color: '#cbd5e1',
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },

  // Layout screens styles
  fullFlexContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  infoFloatingBanner: {
    backgroundColor: '#1e293b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    alignItems: 'center',
  },
  infoFloatingText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  verticalBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  verticalBoxText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  verticalBoxSub: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 4,
  },

  // Horizontal layout
  horizontalRowWrapper: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
  },
  horizontalBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 12,
    paddingVertical: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  horizontalBoxText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  horizontalBoxSub: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    marginTop: 4,
  },

  // WEB LAYOUT SPECIFIC STYLES
  webHeader: {
    height: Platform.OS === 'ios' ? 95 : 85,
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  webLogoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 140,
    borderRightWidth: 1,
    borderRightColor: '#334155',
    paddingRight: 8,
  },
  webLogo: {
    width: 32,
    height: 32,
    marginRight: 6,
  },
  webLogoText: {
    color: '#60a5fa',
    fontSize: 13,
    fontWeight: 'bold',
  },
  webBannerArea: {
    flex: 1,
    marginLeft: 10,
    borderRadius: 8,
    overflow: 'hidden',
    height: '100%',
    position: 'relative',
    backgroundColor: '#0f172a',
  },
  webBannerBg: {
    width: '100%',
    height: '100%',
    opacity: 0.4,
  },
  webBannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingLeft: 12,
  },
  webBannerTitle: {
    color: '#fb7185',
    fontSize: 13,
    fontWeight: 'bold',
  },
  webBannerSub: {
    color: '#f8fafc',
    fontSize: 10,
    marginTop: 1,
  },
  webBody: {
    flex: 1,
    flexDirection: 'row',
  },
  webSidebar: {
    width: 90,
    backgroundColor: '#1e293b',
    borderRightWidth: 1,
    borderRightColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  sidebarItem: {
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  sidebarItemActive: {
    backgroundColor: '#0f172a',
  },
  sidebarText: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  sidebarTextActive: {
    color: '#3b82f6',
  },
  webContentContainer: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  contentHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  contentParagraph: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeading: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 8,
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 10,
    color: '#64748b',
    lineHeight: 14,
  },
  webFooter: {
    backgroundColor: '#0f172a',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    alignItems: 'center',
  },
  footerLink: {
    color: '#3b82f6',
    fontSize: 12,
    textDecorationLine: 'underline',
    fontWeight: '500',
    marginBottom: 8,
  },
  socialIconsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  socialIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  footerCopyright: {
    color: '#64748b',
    fontSize: 10,
  },

  // Array State screen styles
  formContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 6,
    fontSize: 13,
  },
  btnSmall: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 40,
  },
  operationsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  btnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  btnOutlineText: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  listContainer: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
    minHeight: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '600',
  },
  itemPrice: {
    color: '#10b981',
    fontSize: 12,
    marginTop: 2,
  },
  btnDelete: {
    padding: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  totalLabel: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
  },
  totalValue: {
    color: '#fbbf24',
    fontSize: 15,
    fontWeight: 'bold',
  },
  codeFeedbackCard: {
    backgroundColor: '#020617',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  codeFeedbackHeader: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  codeFeedbackText: {
    color: '#60a5fa',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 16,
  },
  ruleBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  ruleBoxGreen: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  ruleTitle: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ruleDesc: {
    color: '#f87171',
    fontSize: 11,
    lineHeight: 15,
  },
  // FlatList Tab Specific Styles
  flatListColumnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  flatListContent: {
    paddingBottom: 40,
  },
  flatListHeaderContainer: {
    padding: 16,
  },
  flatListTheoryCard: {
    backgroundColor: '#1e293b',
    borderColor: '#2563eb',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  theoryHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 6,
  },
  theoryBody: {
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 16,
  },
  sourceTypeToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 4,
    marginBottom: 12,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleBtnActive: {
    backgroundColor: '#2563eb',
  },
  toggleBtnText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
  },
  toggleBtnTextActive: {
    color: '#fff',
  },
  subLabel: {
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 6,
    fontWeight: '600',
  },
  assetSelectorContainer: {
    marginBottom: 12,
  },
  assetOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  assetOption: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  assetOptionActive: {
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  assetOptionText: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '500',
  },
  urlInputContainer: {
    marginBottom: 12,
  },
  presetUrlsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  presetUrlBtn: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },
  presetUrlBtnActive: {
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  presetUrlText: {
    color: '#cbd5e1',
    fontSize: 10,
    fontWeight: '500',
  },
  urlTextInput: {
    backgroundColor: '#0f172a',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: '#fff',
    fontSize: 12,
  },
  detectorOutputBox: {
    backgroundColor: '#020617',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  detectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detectorLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
    flex: 0.4,
  },
  detectorValueType: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: 'bold',
    flex: 0.6,
    textAlign: 'right',
  },
  detectorValueContent: {
    color: '#e2e8f0',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    flex: 0.6,
    textAlign: 'right',
  },
  previewSection: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  previewImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  inputLabel: {
    color: '#cbd5e1',
    fontSize: 11,
    marginBottom: 4,
    fontWeight: '600',
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  flatListInput: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
    color: '#fff',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  flatListAddBtn: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 8,
    gap: 6,
  },
  listHeading: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  flatListCard: {
    width: cardWidth,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  flatListImageWrapper: {
    width: '100%',
    height: cardWidth - 24,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
    position: 'relative',
    marginBottom: 8,
  },
  flatListImage: {
    width: '100%',
    height: '100%',
  },
  flatListIndexBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  flatListIndexText: {
    color: '#60a5fa',
    fontSize: 9,
    fontWeight: 'bold',
  },
  flatListCardName: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
    width: '100%',
  },
  flatListCardPrice: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  flatListDeleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    gap: 4,
    width: '100%',
  },
  flatListDeleteBtnText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  flatListEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#334155',
    width: '100%',
  },
  flatListEmptyText: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  flatListFooterContainer: {
    padding: 16,
  },
  flatListTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  flatListTotalLabel: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
  },
  flatListTotalValue: {
    color: '#fbbf24',
    fontSize: 15,
    fontWeight: 'bold',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bulletIcon: {
    color: '#2563eb',
    fontSize: 14,
    marginRight: 6,
    lineHeight: 16,
  },
  bulletText: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 15,
    flex: 1,
  },
});
