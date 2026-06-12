import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart, CartItem } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getProductImageUrl } from './HomeScreen';
import GlobalHeader from '../components/GlobalHeader';

type CartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CartScreenProps {
  navigation: CartScreenNavigationProp;
}

const formatPrice = (value: number) => {
  return value.toLocaleString('vi-VN') + ' ₫';
};

export const getBrandFromName = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('sony')) return 'Sony';
  if (n.includes('canon')) return 'Canon';
  if (n.includes('nikon')) return 'Nikon';
  if (n.includes('fujifilm')) return 'Fujifilm';
  if (n.includes('dji')) return 'DJI';
  if (n.includes('sandisk')) return 'SanDisk';
  if (n.includes('godox')) return 'Godox';
  if (n.includes('peak design')) return 'Peak Design';
  if (n.includes('lowepro')) return 'Lowepro';
  return 'HuyTuân Digital';
};

export default function CartScreen({ navigation }: CartScreenProps) {
  const { cart, totalPrice, updateQuantity, removeFromCart, loadCart } = useCart();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    loadCart();
    const unsubscribe = navigation.addListener('focus', () => {
      loadCart();
    });
    return unsubscribe;
  }, []);

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Thông báo', 'Giỏ hàng của bạn đang trống!');
      return;
    }
    if (!isLoggedIn) {
      Alert.alert(
        'Yêu cầu đăng nhập',
        'Vui lòng đăng nhập để tiến hành thanh toán!',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Đăng nhập', onPress: () => navigation.navigate('LoginTab' as any) }
        ]
      );
      return;
    }
    navigation.navigate('Checkout');
  };

  const handleDeleteItem = (productId: number, pName: string) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn muốn xóa "${pName}" khỏi giỏ hàng?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: () => removeFromCart(productId) }
      ]
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    return (
      <View style={styles.cartCard}>
        <Image source={{ uri: getProductImageUrl(item.product.img) }} style={styles.cartImage} />

        <View style={styles.cardInfo}>
          <Text style={styles.brandName}>{getBrandFromName(item.product.name).toUpperCase()}</Text>
          <Text style={styles.productName} numberOfLines={2}>{item.product.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>{formatPrice(item.product.price)}</Text>
          </View>

          {/* Quantity and Actions */}
          <View style={styles.actionRow}>
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
              >
                <Ionicons name="remove" size={18} color="#333" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
              >
                <Ionicons name="add" size={18} color="#333" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDeleteItem(item.product.id, item.product.name)}
            >
              <Ionicons name="trash-outline" size={18} color="#d9383a" />
              <Text style={styles.deleteText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <GlobalHeader />

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#ccd4da" />
          <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
          <Text style={styles.emptySub}>Hãy quay lại trang chủ chọn mua sản phẩm chất lượng nhé!</Text>
          <TouchableOpacity
            style={styles.shopNowBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' } as any)}
          >
            <Text style={styles.shopNowText}>Tiếp tục mua sắm</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.product.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* ── FOOTER SUMMARY ── */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tạm tính ({cart.reduce((a, b) => a + b.quantity, 0)} món):</Text>
              <Text style={styles.summaryValue}>{formatPrice(totalPrice)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
              <Text style={styles.summaryValueFree}>Miễn phí</Text>
            </View>
            <View style={[styles.summaryRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>Tổng cộng:</Text>
              <Text style={styles.grandTotalValue}>{formatPrice(totalPrice)}</Text>
            </View>

            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={styles.checkoutBtnText}>Tiến hành thanh toán</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#003d79',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: 12,
  },
  cartCard: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 10,
    flexDirection: 'row',
    marginBottom: 10,
  },
  cartImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  brandName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#888',
    letterSpacing: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 2,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  currentPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#d9383a',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 26,
    height: 26,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deleteText: {
    fontSize: 13,
    color: '#d9383a',
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#475569',
    marginTop: 16,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  shopNowBtn: {
    marginTop: 20,
    backgroundColor: '#003d79',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  shopNowText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  summaryValueFree: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16a34a',
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
    marginBottom: 16,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#d9383a',
  },
  checkoutBtn: {
    backgroundColor: '#d9383a',
    height: 44,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  checkoutBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
