import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type OrderSuccessScreenRouteProp = RouteProp<RootStackParamList, 'OrderSuccess'>;
type OrderSuccessScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderSuccess'>;

interface OrderSuccessScreenProps {
  route: OrderSuccessScreenRouteProp;
  navigation: OrderSuccessScreenNavigationProp;
}

const formatPrice = (value: number) => {
  return value.toLocaleString('vi-VN') + ' ₫';
};

export default function OrderSuccessScreen({ route, navigation }: OrderSuccessScreenProps) {
  const { orderId, total, name } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={60} color="#28a745" />
        </View>

        <Text style={styles.successTitle}>ĐẶT HÀNG THÀNH CÔNG!</Text>
        <Text style={styles.successSub}>
          Cảm ơn bạn <Text style={styles.boldText}>{name}</Text> đã tin tưởng chọn mua sản phẩm tại HuyTuân Digital.
        </Text>

        {/* Order Details Panel */}
        <View style={styles.orderCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mã đơn hàng:</Text>
            <Text style={styles.detailValueHighlight}>{orderId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tổng thanh toán:</Text>
            <Text style={styles.detailValuePrice}>{formatPrice(total)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Trạng thái đơn hàng:</Text>
            <Text style={styles.detailValueStatus}>Đang chuẩn bị hàng</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Dự kiến nhận hàng:</Text>
            <Text style={styles.detailValue}>Trong vòng 2 - 3 ngày tới</Text>
          </View>
        </View>

        {/* Notice Info */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={18} color="#003d79" />
          <Text style={styles.infoText}>
            Nhân viên CSKH của HuyTuân Digital sẽ gọi điện thoại xác nhận đơn hàng trong vòng 15 phút tới.
          </Text>
        </View>

        {/* Home Button */}
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' } as any)}
        >
          <Ionicons name="home-outline" size={18} color="#fff" />
          <Text style={styles.homeBtnText}>Quay về Trang chủ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f9fc',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eafaf1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#d4eedd',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#28a745',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  successSub: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#003d79',
  },
  orderCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6c757d',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  detailValueHighlight: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#003d79',
  },
  detailValuePrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#d9383a',
  },
  detailValueStatus: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffc107',
    backgroundColor: '#fffbeb',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    overflow: 'hidden',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e6f0fa',
    padding: 12,
    borderRadius: 6,
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 28,
  },
  infoText: {
    flex: 1,
    fontSize: 11,
    color: '#003d79',
    lineHeight: 16,
  },
  homeBtn: {
    backgroundColor: '#003d79',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    gap: 8,
    width: '100%',
  },
  homeBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
