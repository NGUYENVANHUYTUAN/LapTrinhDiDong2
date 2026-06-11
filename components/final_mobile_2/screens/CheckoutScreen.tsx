import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import * as db from '../database/db';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type CheckoutScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Checkout'>;

interface CheckoutScreenProps {
  navigation: CheckoutScreenNavigationProp;
}

const formatPrice = (value: number) => {
  return value.toLocaleString('vi-VN') + ' ₫';
};

export default function CheckoutScreen({ navigation }: CheckoutScreenProps) {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('cod');

  const handlePlaceOrder = async () => {
    if (!user) {
      Alert.alert('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để tiếp tục thanh toán.');
      return;
    }
    if (!fullName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ và tên!');
      return;
    }
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone.trim())) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ (10-11 chữ số)!');
      return;
    }
    if (address.trim().length < 10) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ nhận hàng chi tiết hơn!');
      return;
    }

    try {
      const orderItems = cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }));

      const orderId = await db.createOrder(
        user.id,
        orderItems,
        address.trim(),
        phone.trim(),
        totalPrice
      );

      // Xóa giỏ hàng trên UI (loadCart sẽ được gọi trong clearCart)
      await clearCart();

      // Điều hướng đến trang thông báo thành công
      navigation.navigate('OrderSuccess', {
        orderId,
        total: totalPrice,
        name: fullName.trim(),
      });
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#003d79" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán đơn hàng</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* ── SHIPPING DETAILS FORM ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin nhận hàng</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Họ và tên <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập đầy đủ họ tên của bạn"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Số điện thoại <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại liên hệ"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Địa chỉ nhận hàng <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
              multiline
              numberOfLines={3}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email (Không bắt buộc)</Text>
            <TextInput
              style={styles.input}
              placeholder="địa_chỉ_email@gmail.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Ghi chú đơn hàng</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Yêu cầu giao giờ hành chính, gọi điện trước khi giao..."
              multiline
              numberOfLines={2}
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </View>

        {/* ── PAYMENT METHODS ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>

          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'cod' && styles.paymentOptionActive]}
            onPress={() => setPaymentMethod('cod')}
          >
            <Ionicons
              name={paymentMethod === 'cod' ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={paymentMethod === 'cod' ? '#003d79' : '#888'}
            />
            <View style={styles.paymentTextCol}>
              <Text style={styles.paymentName}>Thanh toán khi nhận hàng (COD)</Text>
              <Text style={styles.paymentDesc}>Bạn trả tiền mặt khi nhân viên giao hàng tận tay</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'bank' && styles.paymentOptionActive]}
            onPress={() => setPaymentMethod('bank')}
          >
            <Ionicons
              name={paymentMethod === 'bank' ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={paymentMethod === 'bank' ? '#003d79' : '#888'}
            />
            <View style={styles.paymentTextCol}>
              <Text style={styles.paymentName}>Chuyển khoản Ngân hàng (ATM/Banking)</Text>
              <Text style={styles.paymentDesc}>Giao hàng nhanh hơn, nhận ngay ưu đãi tặng quà phụ kiện</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── ORDER BREAKDOWN ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đơn hàng đã chọn</Text>
          {cart.map((item) => (
            <View key={item.product.id} style={styles.itemRow}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.product.name}
              </Text>
              <Text style={styles.itemQty}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>{formatPrice(item.product.price * item.quantity)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>{formatPrice(totalPrice)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* ── STICKY FOOTER ACTION ── */}
      <View style={styles.footer}>
        <View style={styles.footerTotalCol}>
          <Text style={styles.footerTotalLabel}>Thanh toán:</Text>
          <Text style={styles.footerTotalValue}>{formatPrice(totalPrice)}</Text>
        </View>
        <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderBtnText}>Đặt hàng ngay</Text>
        </TouchableOpacity>
      </View>
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
  headerIconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#003d79',
    flex: 1,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#003d79',
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#d9383a',
    paddingLeft: 10,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
  },
  required: {
    color: '#d9383a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1e293b',
    backgroundColor: '#fff',
  },
  textArea: {
    height: 70,
    paddingTop: 8,
    textAlignVertical: 'top',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  paymentOptionActive: {
    borderColor: '#003d79',
    backgroundColor: '#f4f8fc',
  },
  paymentTextCol: {
    marginLeft: 10,
    flex: 1,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  paymentDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    flex: 2,
    fontSize: 12,
    color: '#475569',
  },
  itemQty: {
    flex: 0.5,
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  itemPrice: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#d9383a',
  },
  footer: {
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerTotalCol: {
    flex: 1,
  },
  footerTotalLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  footerTotalValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#d9383a',
    marginTop: 1,
  },
  placeOrderBtn: {
    backgroundColor: '#d9383a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  placeOrderBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
