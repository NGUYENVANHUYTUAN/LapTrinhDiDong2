import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import * as db from '../../database/db';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type AdminDashboardNavigationProp = NativeStackNavigationProp<RootStackParamList>;
interface AdminDashboardProps { navigation: AdminDashboardNavigationProp; }

const formatPrice = (value: number) => {
  return value.toLocaleString('vi-VN') + ' ₫';
};

export default function AdminDashboard({ navigation }: AdminDashboardProps) {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Dashboard Metrics
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const orders = await db.fetchAllOrders();
      const users = await db.fetchUsers();
      const products = await db.fetchProducts();

      // Tính tổng doanh thu từ các đơn hàng không bị hủy
      const revenue = orders
        .filter(o => o.status !== 'Đã hủy')
        .reduce((sum, o) => sum + o.totalPrice, 0);

      setMetrics({
        totalRevenue: revenue,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalProducts: products.length,
      });

      // Lấy 3 đơn hàng gần đây nhất
      setRecentOrders(orders.slice(0, 3));
    } catch (err) {
      console.error('Error loading admin dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
    const unsubscribe = navigation.addListener('focus', () => {
      loadMetrics();
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#003d79" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="shield-checkmark" size={22} color="#003d79" />
          <Text style={styles.headerTitle}>HuyTuân Digital Admin</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
          <Ionicons name="log-out-outline" size={18} color="#d9383a" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* ── WELCOME MESSAGE ── */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Xin chào, <Text style={styles.welcomeAdmin}>Quản trị viên</Text></Text>
          <Text style={styles.welcomeSubtext}>Hôm nay cửa hàng HuyTuân Digital đang hoạt động ổn định.</Text>
        </View>

        {/* ── METRICS GRID ── */}
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIconBg, { backgroundColor: '#d1fae5' }]}>
                <Ionicons name="cash" size={20} color="#059669" />
              </View>
              <Text style={styles.metricLabel}>Doanh thu</Text>
            </View>
            <Text style={[styles.metricVal, { color: '#059669' }]}>{formatPrice(metrics.totalRevenue)}</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIconBg, { backgroundColor: '#dbeafe' }]}>
                <Ionicons name="receipt" size={20} color="#2563eb" />
              </View>
              <Text style={styles.metricLabel}>Đơn hàng</Text>
            </View>
            <Text style={[styles.metricVal, { color: '#2563eb' }]}>{metrics.totalOrders}</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: '#fffbeb', borderColor: '#fde68a' }]}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIconBg, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="people" size={20} color="#d97706" />
              </View>
              <Text style={styles.metricLabel}>Người dùng</Text>
            </View>
            <Text style={[styles.metricVal, { color: '#d97706' }]}>{metrics.totalUsers}</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: '#faf5ff', borderColor: '#e9d5ff' }]}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIconBg, { backgroundColor: '#f3e8ff' }]}>
                <Ionicons name="camera" size={20} color="#7c3aed" />
              </View>
              <Text style={styles.metricLabel}>Sản phẩm</Text>
            </View>
            <Text style={[styles.metricVal, { color: '#7c3aed' }]}>{metrics.totalProducts}</Text>
          </View>
        </View>

        {/* ── QUICK LINKS / NAVIGATION MODULES ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quản lý Hệ thống</Text>
          
          <View style={styles.menuGrid}>
            <TouchableOpacity
              style={styles.menuCard}
              onPress={() => navigation.navigate('ProductManagement')}
              activeOpacity={0.9}
            >
              <View style={[styles.menuIconBg, { backgroundColor: '#eff6ff' }]}>
                <Ionicons name="camera" size={24} color="#003d79" />
              </View>
              <Text style={styles.menuLabel}>Sản phẩm</Text>
              <Text style={styles.menuSubLabel}>Kho máy ảnh & ống kính</Text>
              <Ionicons name="chevron-forward-circle" size={20} color="#003d79" style={styles.cardChevron} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuCard}
              onPress={() => navigation.navigate('CategoryManagement')}
              activeOpacity={0.9}
            >
              <View style={[styles.menuIconBg, { backgroundColor: '#ecfdf5' }]}>
                <Ionicons name="grid" size={24} color="#16a34a" />
              </View>
              <Text style={styles.menuLabel}>Danh mục</Text>
              <Text style={styles.menuSubLabel}>Phân loại nhóm hàng</Text>
              <Ionicons name="chevron-forward-circle" size={20} color="#16a34a" style={styles.cardChevron} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuCard}
              onPress={() => navigation.navigate('OrderManagement')}
              activeOpacity={0.9}
            >
              <View style={[styles.menuIconBg, { backgroundColor: '#fffbeb' }]}>
                <Ionicons name="receipt" size={24} color="#d97706" />
              </View>
              <Text style={styles.menuLabel}>Đơn hàng</Text>
              <Text style={styles.menuSubLabel}>Duyệt đơn & giao nhận</Text>
              <Ionicons name="chevron-forward-circle" size={20} color="#d97706" style={styles.cardChevron} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuCard}
              onPress={() => navigation.navigate('UserManagement')}
              activeOpacity={0.9}
            >
              <View style={[styles.menuIconBg, { backgroundColor: '#faf5ff' }]}>
                <Ionicons name="people" size={24} color="#7c3aed" />
              </View>
              <Text style={styles.menuLabel}>Người dùng</Text>
              <Text style={styles.menuSubLabel}>Phân quyền tài khoản</Text>
              <Ionicons name="chevron-forward-circle" size={20} color="#7c3aed" style={styles.cardChevron} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── RECENT ORDERS PREVIEW ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Đơn hàng mới nhất</Text>
            <TouchableOpacity onPress={() => navigation.navigate('OrderManagement')}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {recentOrders.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có đơn hàng nào trong hệ thống.</Text>
          ) : (
            recentOrders.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.orderRow}
                onPress={() => navigation.navigate('OrderManagement')}
                activeOpacity={0.8}
              >
                <View style={styles.orderMeta}>
                  <View style={styles.orderUserRow}>
                    <Ionicons name="person-circle-outline" size={16} color="#64748b" />
                    <Text style={styles.orderId}>#{order.id} - {order.username}</Text>
                  </View>
                  <Text style={styles.orderDate}>
                    {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
                <View style={styles.orderRight}>
                  <Text style={styles.orderPrice}>{formatPrice(order.totalPrice)}</Text>
                  <View style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        order.status === 'Đã hoàn thành'
                          ? '#d1fae5'
                          : order.status === 'Đã hủy'
                          ? '#fee2e2'
                          : '#dbeafe',
                    }
                  ]}>
                    <Text style={[
                      styles.orderStatus,
                      {
                        color:
                          order.status === 'Đã hoàn thành'
                            ? '#065f46'
                            : order.status === 'Đã hủy'
                            ? '#991b1b'
                            : '#1e40af',
                      }
                    ]}>
                      {order.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  header: {
    height: 55,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    elevation: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#003d79',
    letterSpacing: 0.5,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff5f5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#d9383a',
  },
  scroll: {
    flex: 1,
    padding: 16,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#1e293b',
    fontWeight: '700',
  },
  welcomeAdmin: {
    color: '#003d79',
    fontWeight: '900',
  },
  welcomeSubtext: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  metricIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 16,
    fontWeight: '900',
  },
  metricLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '700',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#003d79',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 13,
    color: '#0056b3',
    fontWeight: '700',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  menuCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  menuIconBg: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
  },
  menuSubLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  cardChevron: {
    position: 'absolute',
    top: 14,
    right: 14,
    opacity: 0.6,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  orderMeta: {
    gap: 4,
    flex: 1,
  },
  orderUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
  },
  orderDate: {
    fontSize: 12,
    color: '#64748b',
    paddingLeft: 20,
  },
  orderRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  orderPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#d9383a',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  orderStatus: {
    fontSize: 11,
    fontWeight: '800',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 10,
  },
});
