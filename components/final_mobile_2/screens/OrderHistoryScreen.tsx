import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import * as db from '../database/db';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import GlobalHeader from '../components/GlobalHeader';

type OrderHistoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
interface OrderHistoryScreenProps { navigation: OrderHistoryScreenNavigationProp; }

const formatPrice = (value: number) => {
  return value.toLocaleString('vi-VN') + ' ₫';
};

export default function OrderHistoryScreen({ navigation }: OrderHistoryScreenProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    if (user) {
      try {
        setLoading(true);
        const userOrders = await db.fetchUserOrders(user.id);
        setOrders(userOrders);
      } catch (err) {
        console.error('Error fetching user orders:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadOrders();
    const unsubscribe = navigation.addListener('focus', () => {
      loadOrders();
    });
    return unsubscribe;
  }, [user]);

  const handleCancelOrder = (orderId: number) => {
    Alert.alert(
      'Hủy đơn hàng',
      'Bạn có chắc chắn muốn hủy đơn hàng này không?',
      [
        { text: 'Quay lại', style: 'cancel' },
        {
          text: 'Hủy đơn',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.updateOrderStatus(orderId, 'Đã hủy');
              Alert.alert('Thành công', 'Đơn hàng của bạn đã được hủy thành công.');
              loadOrders();
            } catch (err) {
              Alert.alert('Lỗi', 'Không thể hủy đơn hàng lúc này.');
            }
          },
        },
      ]
    );
  };

  const renderOrderItem = ({ item }: { item: any }) => {
    const isPending = item.status === 'Đang xử lý';

    return (
      <View style={styles.orderCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
            <Text style={styles.orderDate}>
              Ngày đặt: {new Date(item.orderDate).toLocaleString('vi-VN')}
            </Text>
          </View>
          <View style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === 'Đã hoàn thành'
                  ? '#dcfce7'
                  : item.status === 'Đã hủy'
                  ? '#fee2e2'
                  : '#dbeafe',
            }
          ]}>
            <Text style={[
              styles.statusText,
              {
                color:
                  item.status === 'Đã hoàn thành'
                    ? '#16a34a'
                    : item.status === 'Đã hủy'
                    ? '#d9383a'
                    : '#2563eb',
              }
            ]}>
              {item.status}
            </Text>
          </View>
        </View>

        {/* Items list */}
        <View style={styles.itemsList}>
          {item.items.map((subItem: any, idx: number) => (
            <View key={subItem.id || idx} style={styles.subItemRow}>
              <Text style={styles.subItemName} numberOfLines={1}>
                {subItem.productName}
              </Text>
              <Text style={styles.subItemQty}>x{subItem.quantity}</Text>
              <Text style={styles.subItemPrice}>{formatPrice(subItem.price)}</Text>
            </View>
          ))}
        </View>

        {/* Address and Phone */}
        <View style={styles.addressSection}>
          <Text style={styles.addressText} numberOfLines={1}>
            <Ionicons name="location-outline" size={12} color="#64748b" /> Địa chỉ: {item.address}
          </Text>
          <Text style={styles.addressText}>
            <Ionicons name="call-outline" size={12} color="#64748b" /> SĐT: {item.phone}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <Text style={styles.totalLabel}>
            Tổng thanh toán: <Text style={styles.totalValue}>{formatPrice(item.totalPrice)}</Text>
          </Text>

          {isPending && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => handleCancelOrder(item.id)}
            >
              <Text style={styles.cancelBtnText}>Hủy đơn</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <GlobalHeader />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#003d79" />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={80} color="#cbd5e1" />
          <Text style={styles.emptyText}>Bạn chưa mua đơn hàng nào</Text>
          <Text style={styles.emptySub}>Mọi thông tin mua hàng sẽ được lưu tại đây để bạn tiện quản lý.</Text>
          <TouchableOpacity
            style={styles.shopNowBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' } as any)}
          >
            <Text style={styles.shopNowText}>Mua sắm ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#003d79',
    letterSpacing: 0.5,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 12,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '800',
    color: '#003d79',
  },
  orderDate: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  itemsList: {
    marginVertical: 10,
  },
  subItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subItemName: {
    flex: 2,
    fontSize: 14,
    color: '#334155',
  },
  subItemQty: {
    flex: 0.5,
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
  },
  subItemPrice: {
    flex: 1,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#334155',
    textAlign: 'right',
  },
  addressSection: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingVertical: 8,
    gap: 4,
  },
  addressText: {
    fontSize: 12,
    color: '#64748b',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
    marginTop: 6,
  },
  totalLabel: {
    fontSize: 13,
    color: '#475569',
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#d9383a',
  },
  cancelBtn: {
    borderWidth: 1.5,
    borderColor: '#fca5a5',
    backgroundColor: '#fff5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelBtnText: {
    color: '#d9383a',
    fontSize: 12,
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
});
