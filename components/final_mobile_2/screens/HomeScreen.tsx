import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as db from '../database/db';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import GlobalHeader from '../components/GlobalHeader';
import { products as staticProducts } from '../data/products';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const { width } = Dimensions.get('window');

// Banners for Hero Slider
const SLIDER_BANNERS = [
  {
    id: 1,
    title: 'Fujifilm X100VI',
    subtitle: 'Máy ảnh Compact toàn diện nhất thế giới',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&auto=format&fit=crop&q=80',
    buttonText: 'Mua ngay',
  },
  {
    id: 2,
    title: 'DJI Mini 4 Pro',
    subtitle: 'Khai phá góc nhìn trên cao cùng flycam dưới 249g',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1200&auto=format&fit=crop&q=80',
    buttonText: 'Xem ngay',
  },
  {
    id: 3,
    title: 'Peak Design Everyday',
    subtitle: 'Thiết kế cao cấp, đẳng cấp bảo vệ máy ảnh của bạn',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&auto=format&fit=crop&q=80',
    buttonText: 'Khám phá',
  },
];

// Brand banner configurations
const BRAND_BANNERS = {
  Canon: {
    title: "TOP MÁY ẢNH CANON \"HOT\"",
    image: require('../../../assets/images/canon_banner.png'),
  },
  Nikon: {
    title: "TOP MÁY ẢNH NIKON \"HOT\"",
    image: require('../../../assets/images/nikon_banner.png'),
  },
  Sony: {
    title: "TOP MÁY ẢNH SONY \"HOT\"",
    image: require('../../../assets/images/sony_banner.png'),
  },
  Fujifilm: {
    title: "TOP MÁY ẢNH FUJIFILM \"HOT\"",
    image: require('../../../assets/images/fuji_banner.png'),
  },
  Lenses: {
    title: "TOP ỐNG KÍNH \"HOT\"",
    image: require('../../../assets/images/lenses_banner.png'),
  },
  Flycam: {
    title: "TOP FLYCAM \"HOT\"",
    image: require('../../../assets/images/flycam_banner.png'),
  },
};

export const getProductImageUrl = (imgName: string) => {
  if (!imgName) return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60';
  if (imgName.startsWith('http') || imgName.startsWith('file:') || imgName.startsWith('content:') || imgName.startsWith('data:')) {
    return imgName;
  }
  const images: Record<string, string> = {
    'camera_sony_a7iv.jpg': 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=500&auto=format&fit=crop&q=60',
    'camera_canon_r6.jpg': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60',
    'camera_fuji_xt5.jpg': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format&fit=crop&q=60',
    'camera_nikon_z6.jpg': 'https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=500&auto=format&fit=crop&q=60',
    'lens_sony_gm.jpg': 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&auto=format&fit=crop&q=60',
    'lens_canon.jpg': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=60',
    'lens_nikon.jpg': 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&auto=format&fit=crop&q=60',
    'accessory_sdcard.jpg': 'https://images.unsplash.com/photo-1558244661-d248897f7bc4?w=500&auto=format&fit=crop&q=60',
    'accessory_tripod.jpg': 'https://images.unsplash.com/photo-1590233649088-e8d93708f51a?w=500&auto=format&fit=crop&q=60',
    'accessory_filter.jpg': 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=500&auto=format&fit=crop&q=60',
    'accessory_flash.jpg': 'https://images.unsplash.com/photo-1590233649088-e8d93708f51a?w=500&auto=format&fit=crop&q=60',
    'bag_peak_design.jpg': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60',
    'bag_lowepro.jpg': 'https://images.unsplash.com/photo-1622560480605-d83c5d3bc5c3?w=500&auto=format&fit=crop&q=60',
    'drone_dji_mini4.jpg': 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=60',
    'drone_dji_air3.jpg': 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&auto=format&fit=crop&q=60',
  };
  return images[imgName] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60';
};

const formatPrice = (value: number) => {
  return value.toLocaleString('vi-VN') + ' ₫';
};

// Enrichment interface
interface RichProduct extends db.Product {
  brand: string;
  originalPrice: number;
  rating: number;
  reviews: number;
  badge?: string;
  description?: string;
  specs?: Record<string, string>;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { addToCart } = useCart();
  const [categories, setCategories] = useState<db.Category[]>([]);
  const [enrichedProducts, setEnrichedProducts] = useState<RichProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string>('all');
  const [activeSlide, setActiveSlide] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load and enrich products from SQLite
  const loadData = async () => {
    try {
      const cats = await db.fetchCategories();
      setCategories(cats);

      let dbProds = await db.fetchProducts();

      // Enrich SQLite products using static metadata
      const enriched = dbProds.map((p) => {
        const found = staticProducts.find(
          (sp) => sp.name.toLowerCase().trim() === p.name.toLowerCase().trim()
        );
        if (found) {
          return {
            ...p,
            brand: found.brand,
            originalPrice: found.originalPrice || p.price * 1.15,
            rating: found.rating || 4.8,
            reviews: found.reviews || 12,
            badge: found.badge,
            description: found.description,
            specs: found.specs,
          };
        }

        // Dynamic fallback for newly added Admin products
        let brand = 'Phụ kiện';
        if (p.name.toLowerCase().includes('canon')) brand = 'Canon';
        else if (p.name.toLowerCase().includes('nikon')) brand = 'Nikon';
        else if (p.name.toLowerCase().includes('sony')) brand = 'Sony';
        else if (p.name.toLowerCase().includes('fuji')) brand = 'Fujifilm';
        else if (p.categoryId === 2) brand = 'Lenses';
        else if (p.categoryId === 5) brand = 'Flycam';

        return {
          ...p,
          brand,
          originalPrice: p.price * 1.15,
          rating: 4.7,
          reviews: 5,
          description: 'Sản phẩm mới chính hãng phân phối tại HuyTuân Digital.',
          specs: {},
        };
      });

      setEnrichedProducts(enriched);
    } catch (err) {
      console.error('Error fetching home data:', err);
      Alert.alert('Lỗi', 'Không thể kết nối đến cơ sở dữ liệu. Vui lòng thử lại!');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, []);

  // Auto Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDER_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = async (item: db.Product) => {
    try {
      await addToCart(item, 1);
      Alert.alert('Thành công', `Đã thêm ${item.name} vào giỏ hàng!`);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể thêm sản phẩm vào giỏ hàng.');
    }
  };

  // Filter products for custom grid
  const getFilteredProducts = () => {
    let list = enrichedProducts;

    // Filter by category
    if (selectedCategory) {
      list = list.filter((p) => p.categoryId === selectedCategory);
    }

    // Filter by price
    if (selectedPriceFilter === 'low') {
      list = list.filter((p) => p.price < 20000000);
    } else if (selectedPriceFilter === 'medium') {
      list = list.filter((p) => p.price >= 20000000 && p.price <= 50000000);
    } else if (selectedPriceFilter === 'high') {
      list = list.filter((p) => p.price > 50000000);
    }

    return list;
  };

  const filteredProductsList = getFilteredProducts();

  const renderProductCard = (item: RichProduct, cardWidthVal: number = 155) => {
    const discountPercent = Math.round(
      ((item.originalPrice - item.price) / item.originalPrice) * 100
    );

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.productCard, { width: cardWidthVal }]}
        onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
        activeOpacity={0.9}
      >
        {/* Image & Badges */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: getProductImageUrl(item.img) }} style={styles.productImage} />
          {item.badge ? (
            <View style={[styles.badge, item.badge.includes('Giảm') ? styles.badgeSale : styles.badgeInfo]}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          ) : discountPercent > 0 ? (
            <View style={[styles.badge, styles.badgeSale]}>
              <Text style={styles.badgeText}>-{discountPercent}%</Text>
            </View>
          ) : null}
          <TouchableOpacity style={styles.wishlistIcon}>
            <Ionicons name="heart-outline" size={16} color="#bbb" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <Text style={styles.productBrand}>{item.brand.toUpperCase()}</Text>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Ionicons
                  key={s}
                  name={s <= Math.floor(item.rating) ? 'star' : 'star-outline'}
                  size={10}
                  color="#fbbf24"
                />
              ))}
            </View>
            <Text style={styles.reviewsText}>({item.reviews})</Text>
          </View>

          {/* Pricing */}
          <Text style={styles.currentPrice}>{formatPrice(item.price)}</Text>
          {item.originalPrice > item.price && (
            <Text style={styles.originalPrice}>{formatPrice(item.originalPrice)}</Text>
          )}
        </View>

        {/* Buy Now Button */}
        <TouchableOpacity style={styles.buyButton} onPress={() => handleAddToCart(item)}>
          <Ionicons name="cart-outline" size={14} color="#fff" />
          <Text style={styles.buyButtonText}>MUA NGAY</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // Reusable brand/category section
  const renderBrandSection = (title: string, brandKey: keyof typeof BRAND_BANNERS, items: RichProduct[]) => {
    if (items.length === 0) return null;

    const bannerInfo = BRAND_BANNERS[brandKey];

    const handleViewMore = () => {
      let catId = 1;
      if (brandKey === 'Lenses') catId = 2;
      else if (brandKey === 'Flycam') catId = 5;
      
      const catName = categories.find(c => c.id === catId)?.name || 'Sản phẩm';
      navigation.navigate('CategoryProducts', { categoryId: catId, categoryName: catName });
    };

    return (
      <View style={styles.brandSection} key={brandKey}>
        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <TouchableOpacity onPress={handleViewMore}>
            <Text style={styles.viewMoreText}>Xem thêm <Ionicons name="chevron-forward" size={12} /></Text>
          </TouchableOpacity>
        </View>

        {/* Promotional Wide Banner */}
        <View style={styles.promoBannerContainer}>
          <Image source={bannerInfo.image} style={styles.promoBannerImage} />
          <View style={styles.promoBannerOverlay}>
            <Text style={styles.promoBannerText}>{bannerInfo.title}</Text>
          </View>
        </View>

        {/* Products List */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {items.map((prod) => renderProductCard(prod, 160))}
        </ScrollView>
      </View>
    );
  };

  // Categorized listings
  const canonProds = enrichedProducts.filter((p) => p.brand === 'Canon' && p.categoryId === 1);
  const nikonProds = enrichedProducts.filter((p) => p.brand === 'Nikon' && p.categoryId === 1);
  const sonyProds = enrichedProducts.filter((p) => p.brand === 'Sony' && p.categoryId === 1);
  const fujiProds = enrichedProducts.filter((p) => p.brand === 'Fujifilm' && p.categoryId === 1);
  const lensesProds = enrichedProducts.filter((p) => p.categoryId === 2);
  const flycamProds = enrichedProducts.filter((p) => p.categoryId === 5);

  const isFilteringActive = selectedCategory !== null || selectedPriceFilter !== 'all';

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <GlobalHeader activeTab="TRANG CHỦ" hideSubNavBar={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#003d79" />
          <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <GlobalHeader activeTab="TRANG CHỦ" hideSubNavBar={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.mainScrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#003d79']} />
        }
      >
        
        {/* ── CATEGORY & PRICE FILTERS (CHIPS) ── */}
        <View style={styles.chipsSection}>
          {/* Categories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            <TouchableOpacity
              style={[styles.chip, selectedCategory === null && styles.chipActive]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={[styles.chipText, selectedCategory === null && styles.chipTextActive]}>Tất cả</Text>
            </TouchableOpacity>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, selectedCategory === cat.id && styles.chipActive]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text style={[styles.chipText, selectedCategory === cat.id && styles.chipTextActive]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Prices */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.chipsRow, { marginTop: 10 }]}>
            <TouchableOpacity
              style={[styles.chip, selectedPriceFilter === 'all' && styles.chipActive]}
              onPress={() => setSelectedPriceFilter('all')}
            >
              <Text style={[styles.chipText, selectedPriceFilter === 'all' && styles.chipTextActive]}>Tất cả giá</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chip, selectedPriceFilter === 'low' && styles.chipActive]}
              onPress={() => setSelectedPriceFilter('low')}
            >
              <Text style={[styles.chipText, selectedPriceFilter === 'low' && styles.chipTextActive]}>Dưới 20 triệu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chip, selectedPriceFilter === 'medium' && styles.chipActive]}
              onPress={() => setSelectedPriceFilter('medium')}
            >
              <Text style={[styles.chipText, selectedPriceFilter === 'medium' && styles.chipTextActive]}>20tr - 50tr</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chip, selectedPriceFilter === 'high' && styles.chipActive]}
              onPress={() => setSelectedPriceFilter('high')}
            >
              <Text style={[styles.chipText, selectedPriceFilter === 'high' && styles.chipTextActive]}>Trên 50 triệu</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {!isFilteringActive ? (
          /* ── LANDING PAGE VIEW (DEFAULT) ── */
          <>
            {/* Hero Banner Slider */}
            <View style={styles.sliderContainer}>
              <Image
                source={{ uri: SLIDER_BANNERS[activeSlide].image }}
                style={styles.sliderImage}
              />
              <View style={styles.sliderOverlay}>
                <Text style={styles.sliderTitle}>{SLIDER_BANNERS[activeSlide].title}</Text>
                <Text style={styles.sliderSubtitle}>{SLIDER_BANNERS[activeSlide].subtitle}</Text>
                
                <TouchableOpacity
                  style={styles.sliderBtn}
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate('CategoryProducts', { categoryId: 1, categoryName: 'Máy ảnh' });
                  }}
                >
                  <Text style={styles.sliderBtnText}>{SLIDER_BANNERS[activeSlide].buttonText}</Text>
                  <Ionicons name="arrow-forward" size={12} color="#fff" />
                </TouchableOpacity>

                {/* Slider Dots */}
                <View style={styles.dotsRow}>
                  {SLIDER_BANNERS.map((_, index) => (
                    <View
                      key={index}
                      style={[styles.dot, activeSlide === index && styles.activeDot]}
                    />
                  ))}
                </View>
              </View>
            </View>

            {/* Branded Sections */}
            {renderBrandSection("TOP MÁY ẢNH CANON", "Canon", canonProds)}
            {renderBrandSection("TOP MÁY ẢNH NIKON", "Nikon", nikonProds)}
            {renderBrandSection("TOP MÁY ẢNH SONY", "Sony", sonyProds)}
            {renderBrandSection("TOP MÁY ẢNH FUJIFILM", "Fujifilm", fujiProds)}
            {renderBrandSection("TOP ỐNG KÍNH", "Lenses", lensesProds)}
            {renderBrandSection("TOP FLYCAM", "Flycam", flycamProds)}
          </>
        ) : (
          /* ── GRID FILTERED VIEW ── */
          <View style={styles.gridSection}>
            <View style={styles.gridHeader}>
              <Text style={styles.gridHeaderTitle}>KẾT QUẢ TÌM LỌC</Text>
              <Text style={styles.gridHeaderCount}>({filteredProductsList.length} sản phẩm)</Text>
            </View>

            {filteredProductsList.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="camera-outline" size={64} color="#cbd5e1" />
                <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào phù hợp</Text>
                <TouchableOpacity style={styles.resetBtn} onPress={() => { setSelectedCategory(null); setSelectedPriceFilter('all'); }}>
                  <Text style={styles.resetBtnText}>Xóa bộ lọc</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={filteredProductsList}
                renderItem={({ item }) => renderProductCard(item, (width - 40) / 2)}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                numColumns={2}
                columnWrapperStyle={styles.gridRow}
                contentContainerStyle={styles.gridContent}
              />
            )}
          </View>
        )}

        {/* ── FOOTER ADDRESS & BRAND TRUST ── */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerHeader}>HUYTUÂN DIGITAL - TECH STORE</Text>
          <View style={styles.addressBlock}>
            <Ionicons name="location-outline" size={14} color="#888" />
            <Text style={styles.addressText}>Địa chỉ: 99 Tô Hiến Thành, TP. Đà Nẵng</Text>
          </View>
          <View style={styles.addressBlock}>
            <Ionicons name="call-outline" size={14} color="#888" />
            <Text style={styles.addressText}>Hotline: 0934731557</Text>
          </View>
          <View style={styles.copyrightContainer}>
            <Text style={styles.copyrightText}>© 2026 HuyTuân Digital. Thiết kế chuyên nghiệp.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f9fc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  mainScrollView: {
    flex: 1,
  },
  chipsSection: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
  },
  chipsRow: {
    paddingLeft: 12,
    paddingRight: 4,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#003d79',
    borderColor: '#003d79',
  },
  chipText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#fff',
  },
  sliderContainer: {
    height: 190,
    margin: 12,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
  },
  sliderImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  sliderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 37, 76, 0.48)',
    padding: 16,
    justifyContent: 'flex-end',
  },
  sliderTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },
  sliderSubtitle: {
    color: '#e2f0fd',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 12,
  },
  sliderBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#d9383a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
    marginBottom: 8,
  },
  sliderBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  activeDot: {
    backgroundColor: '#fbbf24',
    width: 16,
  },
  brandSection: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#003d79',
    borderLeftWidth: 4,
    borderLeftColor: '#d9383a',
    paddingLeft: 10,
  },
  viewMoreText: {
    fontSize: 13,
    color: '#003d79',
    fontWeight: '700',
  },
  promoBannerContainer: {
    height: 130,
    marginHorizontal: 12,
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
  },
  promoBannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  promoBannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  promoBannerText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 1,
  },
  horizontalScrollContent: {
    paddingLeft: 12,
    paddingRight: 4,
    gap: 12,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    justifyContent: 'space-between',
    elevation: 2,
    marginBottom: 4,
  },
  imageContainer: {
    height: 120,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeSale: {
    backgroundColor: '#d9383a',
  },
  badgeInfo: {
    backgroundColor: '#f59e0b',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  wishlistIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  cardContent: {
    padding: 10,
    flex: 1,
  },
  productBrand: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 4,
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: 18,
    height: 36,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  starsRow: {
    flexDirection: 'row',
  },
  reviewsText: {
    fontSize: 10,
    color: '#64748b',
  },
  currentPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: '#d9383a',
    marginTop: 10,
  },
  originalPrice: {
    fontSize: 12,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  buyButton: {
    backgroundColor: '#003d79',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gridSection: {
    padding: 12,
    backgroundColor: '#fff',
  },
  gridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  gridHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#003d79',
    borderLeftWidth: 4,
    borderLeftColor: '#d9383a',
    paddingLeft: 10,
  },
  gridHeaderCount: {
    fontSize: 12,
    color: '#64748b',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  resetBtn: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#003d79',
    borderRadius: 8,
  },
  resetBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  gridContent: {
    paddingBottom: 20,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  footerContainer: {
    backgroundColor: '#1a1d20',
    padding: 24,
    borderTopWidth: 4,
    borderTopColor: '#d9383a',
    marginTop: 20,
  },
  footerHeader: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  addressBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  addressText: {
    color: '#bbb',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  copyrightContainer: {
    borderTopWidth: 1,
    borderTopColor: '#2b303a',
    marginTop: 20,
    paddingTop: 16,
    alignItems: 'center',
  },
  copyrightText: {
    color: '#666',
    fontSize: 11,
  },
});