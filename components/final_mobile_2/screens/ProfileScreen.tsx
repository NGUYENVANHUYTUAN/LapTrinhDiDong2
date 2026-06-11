import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import * as db from '../database/db';
import GlobalHeader from '../components/GlobalHeader';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
interface ProfileScreenProps { navigation: ProfileScreenNavigationProp; }

const formatPrice = (value: number) => value.toLocaleString('vi-VN') + ' ₫';

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user, isLoggedIn, logout, updateProfile } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  
  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newFullname, setNewFullname] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const loadOrders = async () => {
    if (user) {
      try {
        const userOrders = await db.fetchUserOrders(user.id);
        // Lấy 2 đơn hàng gần nhất
        setOrders(userOrders.slice(0, 2));
      } catch (err) {
        console.error('Error fetching profile orders:', err);
      }
    }
  };

  useEffect(() => {
    loadOrders();
    if (user) {
      setNewUsername(user.username);
      setNewFullname(user.fullname || '');
      setNewEmail(user.email || '');
      setNewPhone(user.phone || '');
      setNewAddress(user.address || '');
    }
    const unsubscribe = navigation.addListener('focus', () => {
      loadOrders();
    });
    return unsubscribe;
  }, [user]);

  const handleSaveProfile = async () => {
    if (!newUsername.trim()) {
      Alert.alert('Lỗi', 'Tên đăng nhập không được để trống!');
      return;
    }
    
    try {
      const res = await updateProfile(
        newUsername.trim(),
        newFullname.trim(),
        newEmail.trim(),
        newPhone.trim(),
        newAddress.trim(),
        newPassword.trim() || undefined
      );
      if (res.success) {
        Alert.alert('Thành công', res.message);
        setIsEditing(false);
        setNewPassword('');
      } else {
        Alert.alert('Thất bại', res.message);
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể lưu thông tin lúc này.');
    }
  };

  // ── NOT LOGGED IN VIEW ──
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <GlobalHeader />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Guest Hero */}
          <View style={styles.guestHero}>
            <View style={styles.guestAvatarCircle}>
              <Ionicons name="person-outline" size={44} color="#94a3b8" />
            </View>
            <Text style={styles.guestTitle}>Chào mừng bạn!</Text>
            <Text style={styles.guestSubtitle}>
              Đăng nhập để xem lịch sử đơn hàng, quản lý thông tin và nhận ưu đãi độc quyền từ HuyTuân Digital.
            </Text>

            {/* CTA Buttons */}
            <TouchableOpacity
              style={styles.loginHeroBtn}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.85}
            >
              <Ionicons name="log-in-outline" size={20} color="#fff" />
              <Text style={styles.loginHeroBtnText}>ĐĂNG NHẬP NGAY</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerHeroBtn}
              onPress={() => navigation.navigate('Register')}
            >
              <Ionicons name="person-add-outline" size={18} color="#003d79" />
              <Text style={styles.registerHeroBtnText}>Tạo tài khoản miễn phí</Text>
            </TouchableOpacity>
          </View>

          {/* Benefits preview */}
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsSectionTitle}>Lợi ích khi đăng ký thành viên</Text>
            {[
              { icon: 'ribbon-outline', color: '#f59e0b', title: 'Thành viên VIP', desc: 'Tích điểm và đổi quà, nhận ưu đãi giảm giá đặc biệt.' },
              { icon: 'notifications-outline', color: '#6366f1', title: 'Thông báo Flash Sale', desc: 'Nhận thông báo sớm nhất khi có chương trình khuyến mãi.' },
              { icon: 'shield-checkmark-outline', color: '#16a34a', title: 'Bảo hành dễ dàng', desc: 'Tra cứu bảo hành, hỗ trợ kỹ thuật ưu tiên.' },
              { icon: 'car-outline', color: '#003d79', title: 'Miễn phí vận chuyển', desc: 'Ưu đãi giao hàng tận nơi cho đơn hàng thành viên.' },
            ].map((b, i) => (
              <View key={i} style={styles.benefitItem}>
                <View style={[styles.benefitIcon, { backgroundColor: b.color + '1a' }]}>
                  <Ionicons name={b.icon as any} size={22} color={b.color} />
                </View>
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>{b.title}</Text>
                  <Text style={styles.benefitDesc}>{b.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <GlobalHeader />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* ── USER CARD ── */}
        <View style={styles.userCard}>
          <View style={styles.cardPattern1} />
          <View style={styles.cardPattern2} />

          <View style={styles.userCardContent}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>
                {user!.username.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user!.fullname || user!.username}</Text>
              {!!user!.fullname && <Text style={styles.userDetailText}>Tên đầy đủ: {user!.fullname}</Text>}
              <Text style={styles.userDetailText}>Tài khoản: {user!.username}</Text>
              {!!user!.email && <Text style={styles.userDetailText}>Email: {user!.email}</Text>}
              {!!user!.phone && <Text style={styles.userDetailText}>SĐT: {user!.phone}</Text>}
              {!!user!.address && <Text style={styles.userDetailText}>Địa chỉ: {user!.address}</Text>}
              <Text style={styles.userEmail}>Vai trò: {user!.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</Text>
              
              <TouchableOpacity 
                style={styles.editProfileBtn} 
                onPress={() => setIsEditing(!isEditing)}
              >
                <Ionicons name="create-outline" size={12} color="#fff" />
                <Text style={styles.editProfileBtnText}>Chỉnh sửa tài khoản</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── EDIT PROFILE FORM ── */}
        {isEditing && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="create-outline" size={18} color="#003d79" />
              <Text style={styles.sectionTitle}>Cập nhật thông tin</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tên đăng nhập mới</Text>
              <TextInput
                style={styles.input}
                value={newUsername}
                onChangeText={setNewUsername}
                placeholder="Nhập tên đăng nhập mới"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Họ và tên mới</Text>
              <TextInput
                style={styles.input}
                value={newFullname}
                onChangeText={setNewFullname}
                placeholder="Ví dụ: Nguyễn Văn Huy"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gmail mới</Text>
              <TextInput
                style={styles.input}
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="Ví dụ: huytuan@gmail.com"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Số điện thoại mới</Text>
              <TextInput
                style={styles.input}
                value={newPhone}
                onChangeText={setNewPhone}
                placeholder="Ví dụ: 0987654321"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Địa chỉ mới</Text>
              <TextInput
                style={styles.input}
                value={newAddress}
                onChangeText={setNewAddress}
                placeholder="Ví dụ: 123 Đường 3/2, Quận Ninh Kiều, Cần Thơ"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mật khẩu mới (Bỏ trống nếu không đổi)</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Nhập mật khẩu mới"
                secureTextEntry
              />
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity 
                style={styles.saveBtn} 
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => {
                  setIsEditing(false);
                  setNewUsername(user!.username);
                  setNewFullname(user!.fullname || '');
                  setNewEmail(user!.email || '');
                  setNewPhone(user!.phone || '');
                  setNewAddress(user!.address || '');
                  setNewPassword('');
                }}
              >
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── ORDER HISTORY PREVIEW ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="receipt-outline" size={18} color="#003d79" />
            <Text style={styles.sectionTitle}>Đơn hàng gần đây</Text>
          </View>

          {orders.length === 0 ? (
            <Text style={styles.emptyOrdersText}>Bạn chưa có đơn hàng nào.</Text>
          ) : (
            orders.map((order) => (
              <View key={order.id} style={styles.orderItem}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>Đơn hàng #{order.id}</Text>
                  <Text style={styles.orderDate}>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</Text>
                </View>
                <Text style={styles.orderItems} numberOfLines={1}>
                  {order.items.map((i: any) => `${i.productName} (x${i.quantity})`).join(', ')}
                </Text>
                <View style={styles.orderFooter}>
                  <Text style={styles.orderTotal}>
                    Tổng cộng: <Text style={styles.price}>{formatPrice(order.totalPrice)}</Text>
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: order.status === 'Đã hoàn thành' ? '#dcfce7' : '#dbeafe' }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: order.status === 'Đã hoàn thành' ? '#16a34a' : '#2563eb' }
                    ]}>
                      {order.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* ── SETTINGS MENU ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings-outline" size={18} color="#003d79" />
            <Text style={styles.sectionTitle}>Cài đặt tài khoản</Text>
          </View>

          {[
            { icon: 'location-outline', label: 'Sổ địa chỉ nhận hàng', color: '#6366f1' },
            { icon: 'card-outline', label: 'Phương thức thanh toán', color: '#0ea5e9' },
            { icon: 'notifications-outline', label: 'Cài đặt thông báo', color: '#f59e0b' },
            { icon: 'help-circle-outline', label: 'Trung tâm trợ giúp CSKH', color: '#10b981' },
          ].map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconCircle, { backgroundColor: item.color + '18' }]}>
                  <Ionicons name={item.icon as any} size={16} color={item.color} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── LOGOUT ── */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={18} color="#d9383a" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: {
    height: 50, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: '#cbd5e1',
  },
  headerTitle: { fontSize: 15, fontWeight: '800', color: '#003d79', letterSpacing: 0.5 },
  scroll: { flex: 1 },

  // ── GUEST ──
  guestHero: {
    backgroundColor: '#fff',
    margin: 16, borderRadius: 20,
    padding: 24, alignItems: 'center',
    shadowColor: '#0f172a', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 6,
  },
  guestAvatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 14, borderWidth: 2, borderColor: '#e2e8f0',
  },
  guestTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b', marginBottom: 8 },
  guestSubtitle: {
    fontSize: 12, color: '#64748b', textAlign: 'center',
    lineHeight: 18, marginBottom: 24, paddingHorizontal: 8,
  },
  loginHeroBtn: {
    width: '100%', height: 48,
    backgroundColor: '#003d79', borderRadius: 12,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
    marginBottom: 10,
  },
  loginHeroBtnText: { color: '#fff', fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  registerHeroBtn: {
    width: '100%', height: 44,
    borderWidth: 1.5, borderColor: '#003d79',
    borderRadius: 12, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#f0f6ff',
  },
  registerHeroBtnText: { color: '#003d79', fontSize: 13, fontWeight: '700' },

  benefitsSection: { marginHorizontal: 16, marginBottom: 20 },
  benefitsSectionTitle: { fontSize: 13, fontWeight: '800', color: '#374151', marginBottom: 12 },
  benefitItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12,
    padding: 14, marginBottom: 8,
    shadowColor: '#0f172a', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
    gap: 12,
  },
  benefitIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  benefitText: { flex: 1 },
  benefitTitle: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
  benefitDesc: { fontSize: 11, color: '#64748b', marginTop: 2, lineHeight: 15 },

  // ── LOGGED IN ──
  userCard: {
    backgroundColor: '#003d79',
    margin: 16, borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#003d79', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  cardPattern1: {
    position: 'absolute', width: 160, height: 160,
    borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.06)',
    top: -40, right: -30,
  },
  cardPattern2: {
    position: 'absolute', width: 100, height: 100,
    borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: 0, left: -20,
  },
  userCardContent: { flexDirection: 'row', padding: 20, alignItems: 'center' },
  avatarCircle: {
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: '#d9383a',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarInitial: { fontSize: 22, fontWeight: '900', color: '#fff' },
  userInfo: { marginLeft: 14, flex: 1 },
  userName: { fontSize: 16, fontWeight: '800', color: '#fff' },
  userEmail: { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  userDetailText: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  editProfileBtnText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  section: { backgroundColor: '#fff', padding: 16, marginBottom: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#003d79' },

  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    height: 38,
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#1e293b',
    backgroundColor: '#fff',
  },
  formActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  saveBtn: {
    backgroundColor: '#003d79',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  cancelBtn: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  cancelBtnText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
  },

  orderItem: {
    borderWidth: 1, borderColor: '#e2e8f0',
    borderRadius: 10, padding: 12, marginBottom: 10,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 12, fontWeight: '700', color: '#003d79' },
  orderDate: { fontSize: 10, color: '#64748b' },
  orderItems: { fontSize: 11, color: '#475569', marginVertical: 6 },
  orderFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 8,
  },
  orderTotal: { fontSize: 11, color: '#555' },
  price: { fontWeight: 'bold', color: '#d9383a' },
  statusBadge: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: '700' },
  emptyOrdersText: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 12,
  },

  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIconCircle: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { fontSize: 13, color: '#1e293b', fontWeight: '500' },

  logoutBtn: {
    margin: 16,
    borderWidth: 1.5, borderColor: '#fca5a5',
    backgroundColor: '#fff5f5',
    height: 48, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
  },
  logoutText: { color: '#d9383a', fontSize: 13, fontWeight: '700' },
});
