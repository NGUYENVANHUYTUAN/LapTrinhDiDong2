import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useCart } from '../context/CartContext';
import * as db from '../database/db';
import { getProductImageUrl } from './HomeScreen';
import { getBrandFromName } from './CartScreen';

const SCREEN_WIDTH = Math.min(Dimensions.get('window').width, 480);
const SIDEBAR_WIDTH = 115;
const RIGHT_WIDTH = SCREEN_WIDTH - SIDEBAR_WIDTH;
const CARD_WIDTH = (RIGHT_WIDTH - 24) / 2;

type CategoryProductsScreenRouteProp = RouteProp<RootStackParamList, 'CategoryProducts'>;
type CategoryProductsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CategoryProducts'>;

interface CategoryProductsScreenProps {
  route: CategoryProductsScreenRouteProp;
  navigation: CategoryProductsScreenNavigationProp;
}

const formatPrice = (value: number) => {
  return value.toLocaleString('vi-VN') + ' ₫';
};

type SortOption = 'default' | 'priceAsc' | 'priceDesc';

export default function CategoryProductsScreen({ route, navigation }: CategoryProductsScreenProps) {
  const { categoryId, categoryName } = route.params;
  const { addToCart } = useCart();

  const [categories, setCategories] = useState<db.Category[]>([]);
  const [products, setProducts] = useState<db.Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(categoryId);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>(categoryName);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const cats = await db.fetchCategories();
      const prods = await db.fetchProducts();
      setCategories(cats);
      setProducts(prods);
    } catch (err) {
      console.error('Error loading CategoryProductsScreen:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCategoryPress = (cat: db.Category) => {
    setSelectedCategoryId(cat.id);
    setSelectedCategoryName(cat.name);
  };

  const getFilteredAndSortedProducts = () => {
    let list = products.filter((p) => p.categoryId === selectedCategoryId);
    if (sortBy === 'priceAsc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      list.sort((a, b) => b.price - a.price);
    }
    return list;
  };

  const displayedProducts = getFilteredAndSortedProducts();

  const renderProductItem = ({ item }: { item: db.Product }) => {
    const brandName = getBrandFromName(item.name);

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
        activeOpacity={0.9}
      >
        <View style={styles.cardImageContainer}>
          <Image source={{ uri: getProductImageUrl(item.img) }} style={styles.productImage} />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.brandText}>{brandName.toUpperCase()}</Text>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>{formatPrice(item.price)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => {
            addToCart({
              id: item.id,
              name: item.name,
              price: item.price,
              img: item.img,
            });
            Alert.alert('Thành công', `Đã thêm ${item.name} vào giỏ hàng!`);
          }}
        >
          <Ionicons name="cart" size={12} color="#fff" />
          <Text style={styles.buyButtonText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#003d79" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedCategoryName}</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* ── SORT BAR ── */}
      <View style={styles.sortBar}>
        <Text style={styles.resultsCount}>Có {displayedProducts.length} sản phẩm</Text>
        <View style={styles.sortOptions}>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'default' && styles.sortBtnActive]}
            onPress={() => setSortBy('default')}
          >
            <Text style={[styles.sortBtnText, sortBy === 'default' && styles.sortBtnTextActive]}>Mặc định</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'priceAsc' && styles.sortBtnActive]}
            onPress={() => setSortBy('priceAsc')}
          >
            <Text style={[styles.sortBtnText, sortBy === 'priceAsc' && styles.sortBtnTextActive]}>Giá ↑</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'priceDesc' && styles.sortBtnActive]}
            onPress={() => setSortBy('priceDesc')}
          >
            <Text style={[styles.sortBtnText, sortBy === 'priceDesc' && styles.sortBtnTextActive]}>Giá ↓</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── MAIN CONTENT (SIDEBAR + PRODUCT GRID) ── */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#003d79" />
        </View>
      ) : (
        <View style={styles.body}>
          {/* Left Sidebar */}
          <View style={styles.sidebar}>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isActive = item.id === selectedCategoryId;
                return (
                  <TouchableOpacity
                    style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
                    onPress={() => handleCategoryPress(item)}
                  >
                    <Text style={[styles.sidebarItemText, isActive && styles.sidebarItemTextActive]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          {/* Right Product Grid */}
          <View style={styles.productsArea}>
            {displayedProducts.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="camera-outline" size={48} color="#cbd5e1" />
                <Text style={styles.emptyText}>Chưa có sản phẩm nào thuộc danh mục này.</Text>
              </View>
            ) : (
              <FlatList
                data={displayedProducts}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderBottomColor: '#cbd5e1',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#003d79',
  },
  sortBar: {
    height: 38,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  resultsCount: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 6,
  },
  sortBtn: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  sortBtnActive: {
    backgroundColor: '#003d79',
    borderColor: '#003d79',
  },
  sortBtnText: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '700',
  },
  sortBtnTextActive: {
    color: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: '#f1f5f9',
    borderRightWidth: 1,
    borderRightColor: '#cbd5e1',
  },
  sidebarItem: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  sidebarItemActive: {
    backgroundColor: '#fff',
    borderLeftColor: '#d9383a',
  },
  sidebarItemText: {
    fontSize: 10.5,
    color: '#475569',
    fontWeight: '600',
  },
  sidebarItemTextActive: {
    color: '#003d79',
    fontWeight: '800',
  },
  productsArea: {
    flex: 1,
    padding: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    width: CARD_WIDTH,
    padding: 6,
    justifyContent: 'space-between',
  },
  cardImageContainer: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  productImage: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
  },
  cardContent: {
    marginTop: 6,
    gap: 2,
  },
  brandText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  productName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1e293b',
    height: 28,
    lineHeight: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  currentPrice: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#d9383a',
  },
  buyButton: {
    backgroundColor: '#003d79',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 26,
    borderRadius: 4,
    marginTop: 8,
    gap: 4,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  emptyText: {
    fontSize: 10.5,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '600',
  },
});
