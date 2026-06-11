import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState, useEffect } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import * as db from '../database/db';
import { RootStackParamList } from '../navigation/types';
import { getProductImageUrl } from './HomeScreen';

type ProductDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;
type ProductDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetails'>;

interface ProductDetailsScreenProps {
  route: ProductDetailsScreenRouteProp;
  navigation: ProductDetailsScreenNavigationProp;
}

const formatPrice = (value: number) => {
  return value.toLocaleString('vi-VN') + ' ₫';
};

export default function ProductDetailsScreen({ route, navigation }: ProductDetailsScreenProps) {
  const { productId } = route.params;
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  
  const [product, setProduct] = useState<db.Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc');
  const [selectedOption, setSelectedOption] = useState('Chính hãng (New)');
  const [qty, setQty] = useState(1);

  // Load product from SQLite
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const prods = await db.fetchProducts();
        const found = prods.find((p) => p.id === productId);
        if (found) {
          setProduct(found);
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#003d79" />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy sản phẩm này!</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Dynamic enrichment for product specs/ratings
  const brandMap: Record<number, string> = {
    1: 'Canon / Sony / Fujifilm / Nikon',
    2: 'Sony FE / Canon RF / Nikon Z',
    3: 'SanDisk / Godox / Joby',
    4: 'Peak Design / Lowepro',
    5: 'DJI Flycam',
  };
  const brand = brandMap[product.categoryId] || 'HuyTuân Digital';
  
  const rating = 4.5 + (product.id % 6) * 0.1;
  const reviews = 15 + (product.id * 11) % 40;
  const originalPrice = product.price * 1.15;
  const hasDiscount = true;
  const discountPercent = 15;

  const getSpecs = () => {
    switch (product.categoryId) {
      case 1: // Máy ảnh
        return {
          'Cảm biến': 'Full-frame CMOS / APS-C',
          'Độ phân giải': '24.2 MP - 45.0 MP',
          'Chống rung': 'Chống rung 5 trục IBIS cực đỉnh',
          'Quay video': '4K UHD 60fps / 8K Cinema',
          'Trọng lượng': '650g',
        };
      case 2: // Ống kính
        return {
          'Tiêu cự': '24-70mm / 50mm / 85mm',
          'Khẩu độ lớn nhất': 'f/1.2 - f/2.8',
          'Kích thước Filter': '77mm / 82mm',
          'Loại ngàm': 'Sony E / Canon RF / Nikon Z',
          'Trọng lượng': '450g',
        };
      case 5: // Flycam
        return {
          'Thời gian bay': 'Lên tới 45 phút',
          'Tầm bay xa': '18 - 20 km',
          'Camera': '4K HDR chất lượng cao',
          'Tránh chướng ngại vật': 'Đa hướng 360 độ',
          'Trọng lượng': '249g (Không cần xin phép)',
        };
      default: // Phụ kiện, Balo
        return {
          'Chất liệu': 'Nylon 400D chống thấm nước / Sợi Carbon',
          'Kích thước': 'Tiêu chuẩn',
          'Xuất xứ': 'Chính hãng',
          'Bảo hành': '12 tháng',
        };
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      Alert.alert(
        'Yêu cầu đăng nhập',
        'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Đăng nhập', onPress: () => navigation.navigate('LoginTab' as any) }
        ]
      );
      return;
    }
    try {
      await addToCart(product, qty);
      Alert.alert('Thành công', `Đã thêm ${qty} x ${product.name} vào giỏ hàng!`);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể thêm vào giỏ hàng. Vui lòng thử lại!');
    }
  };

  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      Alert.alert(
        'Yêu cầu đăng nhập',
        'Vui lòng đăng nhập để tiến hành đặt hàng!',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Đăng nhập', onPress: () => navigation.navigate('LoginTab' as any) }
        ]
      );
      return;
    }
    try {
      await addToCart(product, qty);
      navigation.navigate('CartTab' as any);
    } catch (err) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi tiến hành mua hàng.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ── CUSTOM HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#003d79" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Chi tiết sản phẩm</Text>
        <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.navigate('MainTabs', { screen: 'CartTab' } as any)}>
          <Ionicons name="cart-outline" size={24} color="#003d79" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* ── PRODUCT IMAGE ── */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: getProductImageUrl(product.img) }} style={styles.productImage} />
          {hasDiscount && (
            <View style={[styles.badge, styles.badgeDiscount]}>
              <Text style={styles.badgeText}>GIẢM {discountPercent}%</Text>
            </View>
          )}
        </View>

        {/* ── PRODUCT TITLE & PRICES ── */}
        <View style={styles.infoBlock}>
          <Text style={styles.brandText}>{brand.toUpperCase()}</Text>
          <Text style={styles.productName}>{product.name}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Ionicons
                  key={s}
                  name={s <= Math.floor(rating) ? 'star' : 'star-outline'}
                  size={16}
                  color="#fbbf24"
                />
              ))}
            </View>
            <Text style={styles.ratingText}>{rating.toFixed(1)} / 5</Text>
            <Text style={styles.reviewsText}>({reviews} đánh giá)</Text>
          </View>

          {/* Pricing */}
          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>{formatPrice(product.price)}</Text>
            {hasDiscount && (
              <View style={styles.originalPriceRow}>
                <Text style={styles.originalPrice}>{formatPrice(originalPrice)}</Text>
                <Text style={styles.saveAmount}>Tiết kiệm {formatPrice(originalPrice - product.price)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── PRODUCT OPTIONS & QUANTITY ── */}
        <View style={styles.optionBlock}>
          <Text style={styles.sectionTitle}>Chọn phiên bản / Bảo hành</Text>
          <View style={styles.optionsRow}>
            {['Chính hãng (New)', 'LikeNew 99%'].map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.optionChip, selectedOption === opt && styles.optionChipActive]}
                onPress={() => setSelectedOption(opt)}
              >
                <Text style={[styles.optionChipText, selectedOption === opt && styles.optionChipTextActive]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.quantityRow}>
            <Text style={styles.quantityLabel}>Số lượng mua:</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty((prev) => Math.max(1, prev - 1))}
              >
                <Ionicons name="remove" size={18} color="#555" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{qty}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty((prev) => prev + 1)}
              >
                <Ionicons name="add" size={18} color="#555" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── TABS (DESCRIPTION vs SPECS) ── */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabHeader}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'desc' && styles.tabButtonActive]}
              onPress={() => setActiveTab('desc')}
            >
              <Text style={[styles.tabButtonText, activeTab === 'desc' && styles.tabButtonTextActive]}>
                Mô tả sản phẩm
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'specs' && styles.tabButtonActive]}
              onPress={() => setActiveTab('specs')}
            >
              <Text style={[styles.tabButtonText, activeTab === 'specs' && styles.tabButtonTextActive]}>
                Thông số kỹ thuật
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabContent}>
            {activeTab === 'desc' ? (
              <Text style={styles.descriptionText}>
                {product.name} là sản phẩm phân phối chính hãng bởi HuyTuân Digital. Thiết bị sở hữu những công nghệ tiên tiến nhất trong phân khúc, mang lại trải nghiệm đột phá cho người sử dụng. Bảo hành chính hãng toàn quốc 12 tháng tại các trung tâm ủy quyền. Hỗ trợ trả góp lãi suất 0% cực kỳ hấp dẫn.
              </Text>
            ) : (
              <View style={styles.specsTable}>
                {Object.entries(getSpecs()).map(([key, val], idx) => (
                  <View
                    key={key}
                    style={[styles.specsRow, idx % 2 === 0 ? styles.specsRowEven : styles.specsRowOdd]}
                  >
                    <Text style={styles.specKey}>{key}</Text>
                    <Text style={styles.specVal}>{val}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* ── TRUST & WARRANTY INFO ── */}
        <View style={styles.trustBlock}>
          <View style={styles.trustItem}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#28a745" />
            <View>
              <Text style={styles.trustTitle}>Cam kết chính hãng 100%</Text>
              <Text style={styles.trustDesc}>Bồi thường gấp đôi nếu phát hiện hàng giả hàng nhái</Text>
            </View>
          </View>
          <View style={styles.trustItem}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#003d79" />
            <View>
              <Text style={styles.trustTitle}>Bảo hành chính hãng 12-24 tháng</Text>
              <Text style={styles.trustDesc}>Đổi mới miễn phí trong vòng 7 ngày đầu nếu lỗi nhà SX</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── STICKY FOOTER ACTIONS ── */}
      <View style={styles.footerActions}>
        <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
          <Ionicons name="cart-outline" size={20} color="#003d79" />
          <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowBtn} onPress={handleBuyNow}>
          <Text style={styles.buyNowText}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f9fc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f9fc',
  },
  header: {
    height: 50,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#003d79',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  imageWrapper: {
    height: 250,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    position: 'relative',
  },
  productImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  badgeDiscount: {
    backgroundColor: '#d9383a',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoBlock: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
  },
  brandText: {
    fontSize: 11,
    color: '#888',
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1d20',
    lineHeight: 24,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  stars: {
    flexDirection: 'row',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginLeft: 6,
  },
  reviewsText: {
    fontSize: 11,
    color: '#64748b',
    marginLeft: 6,
  },
  priceRow: {
    marginTop: 12,
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#d9383a',
  },
  originalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  originalPrice: {
    fontSize: 13,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  saveAmount: {
    fontSize: 11,
    color: '#16a34a',
    fontWeight: '700',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  optionBlock: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#003d79',
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  optionChip: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  optionChipActive: {
    borderColor: '#003d79',
    backgroundColor: '#e6f0fa',
  },
  optionChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  optionChipTextActive: {
    color: '#003d79',
    fontWeight: 'bold',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
    paddingTop: 12,
  },
  quantityLabel: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '700',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 32,
    height: 32,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  tabsContainer: {
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  tabHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#d9383a',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '700',
  },
  tabButtonTextActive: {
    color: '#d9383a',
  },
  tabContent: {
    padding: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    textAlign: 'justify',
  },
  specsTable: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  specsRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  specsRowEven: {
    backgroundColor: '#f8fafc',
  },
  specsRowOdd: {
    backgroundColor: '#ffffff',
  },
  specKey: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
  },
  specVal: {
    flex: 2.2,
    fontSize: 12,
    color: '#1e293b',
  },
  trustBlock: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trustTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  trustDesc: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 1,
  },
  footerActions: {
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    padding: 8,
    gap: 10,
  },
  addToCartBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#003d79',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#fff',
  },
  addToCartText: {
    color: '#003d79',
    fontSize: 13,
    fontWeight: 'bold',
  },
  buyNowBtn: {
    flex: 1.2,
    backgroundColor: '#d9383a',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyNowText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 14,
    color: '#d9383a',
    fontWeight: 'bold',
  },
  backBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backBtn: {
    marginTop: 12,
    backgroundColor: '#003d79',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
});
