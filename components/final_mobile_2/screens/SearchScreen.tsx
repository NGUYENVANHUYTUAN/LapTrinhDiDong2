import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as db from '../database/db';
import { useCart } from '../context/CartContext';
import { getProductImageUrl } from './HomeScreen';
import { getBrandFromName } from './CartScreen';
import GlobalHeader from '../components/GlobalHeader';

const SCREEN_WIDTH = Math.min(Dimensions.get('window').width, 480);
const CARD_WIDTH = (SCREEN_WIDTH - 36) / 2;

interface SearchScreenProps {
  navigation?: any;
  route?: any;
}

const formatPrice = (value: number) => {
  return value.toLocaleString('vi-VN') + ' ₫';
};

const popularSearches = [
  'Canon G7 X',
  'Sony A7IV',
  'Nikon Z fc',
  'Fujifilm X-T5',
  'Ống kính Nikkor',
  'Sony A6700'
];

export default function SearchScreen({ navigation, route }: SearchScreenProps) {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<db.Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<db.Product[]>([]);

  // Load all products once
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await db.fetchProducts();
        setAllProducts(data);
      } catch (err) {
        console.error('Error fetching search products:', err);
      }
    };
    loadProducts();
  }, []);

  // Safely extract parameter if redirected from home screen
  const routeParams = route?.params as any;
  const initialQuery = routeParams?.params?.query || routeParams?.query || '';

  useEffect(() => {
    if (initialQuery && allProducts.length > 0) {
      setSearchQuery(initialQuery);
      handleSearch(initialQuery, allProducts);
    }
  }, [initialQuery, allProducts]);

  const handleSearch = (text: string, productsList = allProducts) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setFilteredProducts([]);
      return;
    }
    const queryLower = text.toLowerCase().trim();
    const results = productsList.filter(
      (p) =>
        p.name.toLowerCase().includes(queryLower) ||
        getBrandFromName(p.name).toLowerCase().includes(queryLower)
    );
    setFilteredProducts(results);
  };

  const handleSuggestionPress = (suggestion: string) => {
    handleSearch(suggestion);
  };

  const renderProductItem = ({ item }: { item: db.Product }) => {
    const brand = getBrandFromName(item.name);
    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
        activeOpacity={0.9}
      >
        <View style={styles.cardImageContainer}>
          <Image source={{ uri: getProductImageUrl(item.img) }} style={styles.productImage} />
        </View>

        <View style={styles.cardDetails}>
          <Text style={styles.brandName}>{brand.toUpperCase()}</Text>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>{formatPrice(item.price)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <GlobalHeader />

      {/* ── SEARCH CONTENT ── */}
      {searchQuery.length === 0 ? (
        <View style={styles.suggestWrapper}>
          <Text style={styles.suggestTitle}>Gợi ý tìm kiếm phổ biến</Text>
          <View style={styles.suggestionsContainer}>
            {popularSearches.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.suggestionChip}
                onPress={() => handleSuggestionPress(item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>Không tìm thấy sản phẩm phù hợp</Text>
          <Text style={styles.emptySub}>Thử tìm kiếm với từ khóa khác như "Canon", "Sony"...</Text>
        </View>
      ) : (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsCount}>
            Tìm thấy {filteredProducts.length} sản phẩm tương thích
          </Text>
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.columnWrapper}
          />
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
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    height: 38,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#1e293b',
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  suggestWrapper: {
    padding: 16,
  },
  suggestTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#003d79',
    marginBottom: 12,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  suggestionText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
    marginTop: 16,
  },
  emptySub: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsCount: {
    fontSize: 10,
    color: '#64748b',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 4,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginTop: 8,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    width: CARD_WIDTH,
    padding: 8,
  },
  cardImageContainer: {
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  productImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  cardDetails: {
    marginTop: 8,
  },
  brandName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#888',
    letterSpacing: 1,
  },
  productName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 2,
    height: 32,
    lineHeight: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  currentPrice: {
    fontSize: 12,
    fontWeight: '900',
    color: '#d9383a',
  },
});
