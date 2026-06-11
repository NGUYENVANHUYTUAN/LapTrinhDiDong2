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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as db from '../../database/db';

const formatPrice = (value: number) => {
  return value.toLocaleString('vi-VN') + ' ₫';
};

const STATUSES = ['Tất cả', 'Đang xử lý', 'Đang vận chuyển', 'Đã hoàn thành', 'Đã hủy'];

export default function OrderManagement({ navigation }: any) {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await db.fetchAllOrders();
      setOrders(data);
      applyFilter(data, selectedStatus);
    } catch (err) {
      console.error('Error loading order management data:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (allOrders: any[], status: string) => {
    if (status === 'Tất cả') {
      setFilteredOrders(allOrders);
    } else {
      setFilteredOrders(allOrders.filter(o => o.status === status));
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleFilterChange = (status: string) => {
    setSelectedStatus(status);
    applyFilter(orders, status);
  };

  const handleChangeStatus = (orderId: number, currentStatus: string) => {
    Alert.alert(
      'Cập nhật đơn hàng',
      'Chọn trạng thái đơn hàng mới:',
      STATUSES.filter(s => s !== 'Tất cả' && s !== currentStatus).map(status => ({
        text: status,
        onPress: async () => {
          try {
            await db.updateOrderStatus(orderId, status);
            Alert.alert('Thành công', `Đơn hàng đã được chuyển sang "${status}".`);
            loadOrders();
          } catch (err) {
            Alert.alert('Lỗi', 'Không thể cập nhật trạng thái đơn hàng.');
          }
        }
      })),
      { cancelable: true }
    );
  };

  const renderOrderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.orderCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
            <Text style={styles.customerName}>Khách hàng: {item.username}</Text>
            <Text style={styles.orderDate}>
              Ngày đặt: {new Date(item.orderDate).toLocaleString('vi-VN')}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.status === 'Đã hoàn thành'
                    ? '#dcfce7'
                    : item.status === 'Đã hủy'
                    ? '#fee2e2'
                    : '#dbeafe',
              }
            ]}
            onPress={() => handleChangeStatus(item.id, item.status)}
          >
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
              {item.status} <Ionicons name="caret-down" size={10} />
            </Text>
          </TouchableOpacity>
        </View>

        {/* Detailed Items list */}
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

        {/* Contact Shipping address */}
        <View style={styles.shippingSection}>
          <Text style={styles.shippingText}>
            <Ionicons name="location-outline" size={11} color="#64748b" /> Địa chỉ: {item.address}
          </Text>
          <Text style={styles.shippingText}>
            <Ionicons name="call-outline" size={11} color="#64748b" /> Điện thoại: {item.phone}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.totalLabel}>
            Tổng doanh thu đơn: <Text style={styles.totalValue}>{formatPrice(item.totalPrice)}</Text>
          </Text>
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
        <Text style={styles.headerTitle}>Quản lý đơn hàng</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* ── STATUS FILTER TABS ── */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {STATUSES.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterTab,
                selectedStatus === status && styles.filterTabActive
              ]}
              onPress={() => handleFilterChange(status)}
            >
              <Text style={[
                styles.filterTabText,
                selectedStatus === status && styles.filterTabTextActive
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#003d79" />
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={60} color="#cbd5e1" />
          <Text style={styles.emptyText}>Không tìm thấy đơn hàng nào.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
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
    backgroundColor: '#f1f5f9',
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
    fontSize: 15,
    fontWeight: '800',
    color: '#003d79',
  },
  filterWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
  },
  filterScroll: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  filterTab: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
  },
  filterTabActive: {
    backgroundColor: '#d9383a',
    borderColor: '#d9383a',
  },
  filterTabText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '700',
  },
  filterTabTextActive: {
    color: '#fff',
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
    fontSize: 12,
    fontWeight: '800',
    color: '#003d79',
  },
  customerName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    marginTop: 2,
  },
  orderDate: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 9,
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
    fontSize: 12,
    color: '#334155',
  },
  subItemQty: {
    flex: 0.5,
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
  },
  subItemPrice: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#334155',
    textAlign: 'right',
  },
  shippingSection: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingVertical: 6,
    gap: 3,
  },
  shippingText: {
    fontSize: 10,
    color: '#475569',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 11,
    color: '#475569',
  },
  totalValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#d9383a',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '700',
    marginTop: 8,
  },
});
