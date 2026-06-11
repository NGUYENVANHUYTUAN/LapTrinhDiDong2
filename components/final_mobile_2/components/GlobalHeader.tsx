import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/types';

interface GlobalHeaderProps {
  activeTab?: string;
  hideSubNavBar?: boolean;
}

const navigationTabs = [
  'TRANG CHỦ',
  'MÁY ẢNH',
  'ỐNG KÍNH',
  'FLYCAM',
  'ACTION CAMERA',
  'GIMBAL',
  'MICRO',
  'SKIN',
  'PHỤ KIỆN',
  'DỊCH VỤ SỬA CHỮA',
  'TIN TỨC - SỰ KIỆN',
];

export default function GlobalHeader({ activeTab = '', hideSubNavBar = false }: GlobalHeaderProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { totalCount } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = () => {
    if (searchQuery.trim().length < 2) {
      Alert.alert('Thông báo', 'Vui lòng nhập ít nhất 2 ký tự để tìm kiếm!');
      return;
    }
    navigation.navigate('MainTabs', {
      screen: 'SearchTab',
      params: { query: searchQuery.trim() },
    } as any);
  };

  const handleTabPress = (tab: string) => {
    try {
      if (tab === 'TRANG CHỦ') {
        navigation.navigate('MainTabs', { screen: 'HomeTab' } as any);
      } else if (tab === 'MÁY ẢNH') {
        navigation.navigate('CategoryProducts', { categoryId: 1, categoryName: 'Máy ảnh' });
      } else if (tab === 'ỐNG KÍNH') {
        navigation.navigate('CategoryProducts', { categoryId: 2, categoryName: 'Ống kính' });
      } else if (tab === 'PHỤ KIỆN') {
        navigation.navigate('CategoryProducts', { categoryId: 3, categoryName: 'Phụ kiện' });
      } else if (tab === 'FLYCAM') {
        navigation.navigate('CategoryProducts', { categoryId: 5, categoryName: 'Flycam' });
      } else {
        Alert.alert('Thông báo', `Mục "${tab}" đang được cập nhật, vui lòng quay lại sau!`);
      }
    } catch (err) {
      console.error('Navigation error:', err);
      Alert.alert('Lỗi', 'Không thể chuyển hướng trang. Vui lòng thử lại!');
    }
  };

  return (
    <View style={styles.headerContainer}>
      {/* ── TOP UTILITY BAR (Status Bar Spacing for Android) ── */}
      <View style={[styles.topUtilityBar, Platform.OS === 'android' && { height: 32 + (StatusBar.currentHeight || 0), paddingTop: StatusBar.currentHeight }]}>
        {isLoggedIn ? (
          <View style={styles.loggedInRow}>
            <Text style={styles.loggedInText} numberOfLines={1}>
              Chào, <Text style={styles.usernameText}>{user?.username}</Text>
            </Text>
            <TouchableOpacity style={styles.logoutBtn} onPress={() => {
              Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn đăng xuất?', [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Đăng xuất', onPress: logout, style: 'destructive' }
              ]);
            }}>
              <Text style={styles.logoutText}>Thoát</Text>
              <Ionicons name="log-out-outline" size={12} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <Text style={styles.topUtilityText}>Chào mừng bạn đến với HuyTuân Digital!</Text>
          </View>
        )}
        <View style={styles.topSocials}>
          <Ionicons name="logo-facebook" size={14} color="#fff" style={styles.socialIcon} />
          <Ionicons name="logo-tiktok" size={14} color="#fff" style={styles.socialIcon} />
        </View>
      </View>

      {/* ── MAIN HEADER ── */}
      <View style={styles.mainHeader}>
        {/* Logo */}
        <TouchableOpacity
          style={styles.logoContainer}
          onPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' } as any)}
          activeOpacity={0.8}
        >
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoTextMain}>HUYTUÂN</Text>
            <Text style={styles.logoTextSub}>DIGITAL</Text>
          </View>
        </TouchableOpacity>

        {/* Action Icons */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={() => {
              if (isLoggedIn) {
                if (user?.role === 'admin') {
                  navigation.navigate('AdminTab' as any);
                } else {
                  navigation.navigate('ProfileTab' as any);
                }
              } else {
                navigation.navigate('LoginTab' as any);
              }
            }}
          >
            <Ionicons name="person-outline" size={22} color="#003d79" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={() => {
              if (isLoggedIn) {
                navigation.navigate('CartTab' as any);
              } else {
                Alert.alert('Thông báo', 'Vui lòng đăng nhập để xem giỏ hàng!');
                navigation.navigate('LoginTab' as any);
              }
            }}
          >
            <Ionicons name="cart-outline" size={24} color="#003d79" />
            {totalCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ── SEARCH BAR ROW ── */}
      <View style={styles.searchRowContainer}>
        <View style={styles.searchBarContainer}>
          <TextInput
            placeholder="Tìm máy ảnh, ống kính..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchIconBtn} onPress={handleSearchSubmit}>
            <Ionicons name="search" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── NAVIGATION SUB-BAR ── */}
      {!hideSubNavBar && (
        <View style={styles.subNavBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subNavContent}
          >
            {navigationTabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.subNavBarTab, activeTab === tab && styles.subNavBarTabActive]}
                onPress={() => handleTabPress(tab)}
                activeOpacity={0.8}
              >
                <Text style={[styles.subNavBarText, activeTab === tab && styles.subNavBarTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    backgroundColor: '#fff',
    zIndex: 999,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  topUtilityBar: {
    height: 30,
    backgroundColor: '#00254c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  topUtilityText: {
    color: '#e2f0fd',
    fontSize: 10,
    fontWeight: '600',
  },
  loggedInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  loggedInText: {
    color: '#e2f0fd',
    fontSize: 12,
    maxWidth: '70%',
  },
  usernameText: {
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d9383a',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  logoutText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  topSocials: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  socialIcon: {
    opacity: 0.9,
  },
  mainHeader: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  searchRowContainer: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoImage: {
    width: 32,
    height: 32,
  },
  logoTextContainer: {
    justifyContent: 'center',
  },
  logoTextMain: {
    fontSize: 15,
    fontWeight: '900',
    color: '#003d79',
    lineHeight: 18,
  },
  logoTextSub: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#d9383a',
    letterSpacing: 2,
    lineHeight: 12,
  },
  searchBarContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    height: 38,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 12,
    color: '#1e293b',
    height: '100%',
  },
  searchIconBtn: {
    backgroundColor: '#003d79',
    width: 42,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#d9383a',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  subNavBar: {
    backgroundColor: '#003d79',
    height: 42,
  },
  subNavContent: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  subNavBarTab: {
    paddingHorizontal: 14,
    height: '100%',
    justifyContent: 'center',
  },
  subNavBarTabActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#fbbf24',
  },
  subNavBarText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    opacity: 0.85,
  },
  subNavBarTextActive: {
    opacity: 1,
    color: '#fbbf24',
  },
});
