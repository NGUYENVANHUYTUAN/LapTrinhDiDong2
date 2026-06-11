import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Product {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  discount: number;
  category: string;
  badge?: string;
}

const categories = ['Tất cả', 'Mirrorless', 'DSLR', 'Action Cam', 'Phụ kiện'];

const products: Product[] = [
  {
    id: '1',
    name: 'Canon EOS R6 Mark II + RF 50mm F1.8',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviews: 11,
    price: 45450000,
    originalPrice: 52000000,
    discount: 13,
    category: 'Mirrorless',
    badge: 'Hot',
  },
  {
    id: '2',
    name: 'Sony Alpha A7 IV Body Only',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviews: 24,
    price: 58990000,
    originalPrice: 64900000,
    discount: 9,
    category: 'Mirrorless',
    badge: 'Best',
  },
  {
    id: '3',
    name: 'Fujifilm X-T5 Body Silver',
    image: 'https://images.unsplash.com/photo-1519638396416-e5a9e52e847d?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 18,
    price: 43490000,
    originalPrice: 47900000,
    discount: 9,
    category: 'Mirrorless',
  },
  {
    id: '4',
    name: 'Nikon Z6 II + NIKKOR Z 24-70mm f/4 S',
    image: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=500&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviews: 15,
    price: 49990000,
    originalPrice: 56900000,
    discount: 12,
    category: 'DSLR',
  },
  {
    id: '5',
    name: 'Canon EOS R50 + Lens 18-45mm STM',
    image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 32,
    price: 18990000,
    originalPrice: 21900000,
    discount: 13,
    category: 'Mirrorless',
    badge: 'New',
  },
  {
    id: '6',
    name: 'Sony ZV-E10 Body – Máy Vlogging',
    image: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 45,
    price: 16490000,
    originalPrice: 18900000,
    discount: 12,
    category: 'Mirrorless',
  },
  {
    id: '7',
    name: 'Panasonic Lumix S5 II Full Frame',
    image: 'https://images.unsplash.com/photo-1597200381847-30ec200eeb9b?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 20,
    price: 41990000,
    originalPrice: 46900000,
    discount: 10,
    category: 'Mirrorless',
  },
  {
    id: '8',
    name: 'OM System OM-5 Body – Chống Thời Tiết',
    image: 'https://images.unsplash.com/photo-1471897488648-5eae4ac6686b?w=500&auto=format&fit=crop&q=80',
    rating: 4.4,
    reviews: 9,
    price: 21490000,
    originalPrice: 24900000,
    discount: 14,
    category: 'DSLR',
  },
  {
    id: '9',
    name: 'GoPro HERO 12 Black – Action 5.3K',
    image: 'https://images.unsplash.com/photo-1551721434-8b94ddff0e6d?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 68,
    price: 9990000,
    originalPrice: 11900000,
    discount: 16,
    category: 'Action Cam',
    badge: 'Sale',
  },
  {
    id: '10',
    name: 'DJI Osmo Pocket 3 – Camera 4K 120fps',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 53,
    price: 10990000,
    originalPrice: 12500000,
    discount: 12,
    category: 'Action Cam',
  },
  {
    id: '11',
    name: 'Nikon Zf Body – Cổ Điển Full Frame',
    image: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=500&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviews: 14,
    price: 39990000,
    originalPrice: 44900000,
    discount: 11,
    category: 'DSLR',
  },
  {
    id: '12',
    name: 'Sigma fp L Body – Mirrorless Nhỏ Gọn',
    image: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=500&auto=format&fit=crop&q=80',
    rating: 4.3,
    reviews: 7,
    price: 52990000,
    originalPrice: 57900000,
    discount: 8,
    category: 'Mirrorless',
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

const formatCurrency = (value: number) =>
  value.toLocaleString('vi-VN') + 'đ';

const StarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating % 1 !== 0;
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= full ? 'star' : i === full + 1 && half ? 'star-half' : 'star-outline'}
          size={10}
          color={i <= full || (i === full + 1 && half) ? '#f59e0b' : '#d1d5db'}
        />
      ))}
    </View>
  );
};

const ProductCard = React.memo(({ item }: { item: Product }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.9}>
    <View style={styles.imageWrapper}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      {item.badge && (
        <View style={[
          styles.badge,
          item.badge === 'Hot' && styles.badgeHot,
          item.badge === 'Sale' && styles.badgeSale,
          item.badge === 'Best' && styles.badgeBest,
          item.badge === 'New' && styles.badgeNew,
        ]}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.wishlist}>
        <Ionicons name="heart-outline" size={16} color="#ef4444" />
      </TouchableOpacity>
    </View>
    <View style={styles.cardBody}>
      <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
      <StarRating rating={item.rating} />
      <Text style={styles.reviewCount}>({item.reviews} đánh giá)</Text>
      <Text style={styles.price}>{formatCurrency(item.price)}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.originalPrice}>{formatCurrency(item.originalPrice)}</Text>
        <Text style={styles.discountText}>-{item.discount}%</Text>
      </View>
      <TouchableOpacity style={styles.addToCart} activeOpacity={0.85}>
        <Ionicons name="cart-outline" size={13} color="#fff" />
        <Text style={styles.addToCartText}>Mua ngay</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
));

const Layout1 = () => {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [cartCount] = useState(2);

  const filtered =
    activeCategory === 'Tất cả'
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <View style={styles.screen}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBox}>
            <Ionicons name="camera" size={22} color="#fff" />
          </View>
          <View>
            <Text style={styles.storeName}>CameraShop</Text>
            <Text style={styles.storeSlogan}>Chính hãng – Uy tín</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="search-outline" size={21} color="#1e293b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="bag-outline" size={21} color="#1e293b" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ── BANNER ── */}
      <View style={styles.banner}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&auto=format&fit=crop&q=80' }}
          style={styles.bannerImage}
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerLabel}>⚡ Flash Sale hôm nay</Text>
          <Text style={styles.bannerTitle}>Giảm đến 16%</Text>
          <Text style={styles.bannerSub}>Máy ảnh & phụ kiện cao cấp</Text>
          <TouchableOpacity style={styles.bannerBtn}>
            <Text style={styles.bannerBtnText}>Xem ngay</Text>
            <Ionicons name="arrow-forward" size={13} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── CATEGORY FILTER ── */}
      <View style={styles.categoryWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, activeCategory === cat && styles.chipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── SECTION TITLE ── */}
      <View style={styles.sectionRow}>
        <View style={styles.sectionLeft}>
          <Ionicons name="camera-outline" size={18} color="#6366f1" />
          <Text style={styles.sectionTitle}>Sản Phẩm Nổi Bật</Text>
        </View>
        <View style={styles.sectionRight}>
          <Text style={styles.countText}>{filtered.length} sản phẩm</Text>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={14} color="#6366f1" />
            <Text style={styles.filterText}>Lọc</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── PRODUCT GRID ── */}
      <FlatList
        data={filtered}
        renderItem={({ item }) => <ProductCard item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* ── FOOTER ── */}
      <View style={styles.footer}>
        <Ionicons name="camera" size={16} color="#94a3b8" />
        <Text style={styles.footerText}>  © 2025 CameraShop – Bản quyền được bảo lưu</Text>
      </View>
    </View>
  );
};

export default Layout1;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 40,
    height: 40,
    backgroundColor: '#6366f1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  storeSlogan: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },

  // Banner
  banner: {
    height: 170,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.52)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  bannerLabel: {
    fontSize: 11,
    color: '#fbbf24',
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 32,
  },
  bannerSub: {
    fontSize: 13,
    color: '#cbd5e1',
    marginTop: 2,
    marginBottom: 12,
  },
  bannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
  },
  bannerBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  // Category
  categoryWrapper: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    marginTop: 10,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: '#ede9fe',
    borderColor: '#6366f1',
  },
  chipText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#6366f1',
    fontWeight: '700',
  },

  // Section row
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  sectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#ede9fe',
  },
  filterText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
  },

  // Grid
  columnWrapper: {
    paddingHorizontal: 16,
    gap: 16,
    justifyContent: 'space-between',
  },
  listContent: {
    paddingBottom: 16,
    gap: 16,
  },

  // Card
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  imageWrapper: {
    height: 145,
    backgroundColor: '#f8fafc',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeHot: { backgroundColor: '#ef4444' },
  badgeSale: { backgroundColor: '#f97316' },
  badgeBest: { backgroundColor: '#10b981' },
  badgeNew: { backgroundColor: '#6366f1' },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  wishlist: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    backgroundColor: '#fff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardBody: {
    padding: 10,
  },
  cardName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 17,
    height: 34,
    marginBottom: 4,
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  reviewCount: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ef4444',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 11,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  discountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10b981',
  },
  addToCart: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 8,
    gap: 5,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: '#1e293b',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 12,
  },
});
