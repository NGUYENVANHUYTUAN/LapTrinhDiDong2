import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;
interface RegisterScreenProps { navigation: RegisterScreenNavigationProp; }

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { register } = useAuth();
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusField, setFocusField] = useState('');
  const [success, setSuccess] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const validate = () => {
    if (!fullname.trim()) return 'Vui lòng nhập họ và tên!';
    if (!username.trim()) return 'Vui lòng nhập tên đăng nhập!';
    if (username.trim().length < 3) return 'Tên đăng nhập phải chứa ít nhất 3 ký tự!';
    if (!email.trim()) return 'Vui lòng nhập địa chỉ email!';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return 'Địa chỉ email không hợp lệ!';
    if (!phone.trim()) return 'Vui lòng nhập số điện thoại!';
    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(phone.trim())) return 'Số điện thoại không hợp lệ (9 - 11 chữ số)!';
    if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự!';
    if (password !== confirmPassword) return 'Mật khẩu xác nhận không khớp!';
    if (!agreed) return 'Bạn cần đồng ý với điều khoản dịch vụ để tiếp tục!';
    return null;
  };

  const handleRegister = async () => {
    setError('');
    const validationError = validate();
    if (validationError) { setError(validationError); shake(); return; }

    setLoading(true);
    const result = await register(
      username.trim(),
      password,
      email.trim(),
      phone.trim(),
      fullname.trim()
    );
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      Animated.spring(successScale, { toValue: 1, useNativeDriver: true, tension: 100, friction: 7 }).start();
      setTimeout(() => navigation.navigate('MainTabs', { screen: 'ProfileTab' } as any), 1800);
    } else {
      setError(result.message);
      shake();
    }
  };

  const isFocused = (field: string) => focusField === field;

  if (success) {
    return (
      <SafeAreaView style={styles.successSafe}>
        <Animated.View style={[styles.successContainer, { transform: [{ scale: successScale }] }]}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color="#16a34a" />
          </View>
          <Text style={styles.successTitle}>Đăng ký thành công!</Text>
          <Text style={styles.successSub}>Chào mừng bạn đến với HuyTuân Digital 🎉</Text>
          <ActivityIndicator color="#003d79" style={{ marginTop: 16 }} />
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* ── HERO ── */}
          <View style={styles.heroSection}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>

            <View style={styles.logoWrapper}>
              <View style={styles.logoCircle}>
                <Image
                  source={require('../../../assets/images/logo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.heroTitle}>Tạo tài khoản</Text>
              <Text style={styles.heroSubtitle}>Tham gia cộng đồng mua sắm của HuyTuân Digital</Text>
            </View>

            {/* Benefit pills */}
            <View style={styles.benefitRow}>
              {['🎁 Quà tặng thành viên', '🚚 Giao hàng ưu tiên', '⭐ Tích điểm'].map((b) => (
                <View key={b} style={styles.benefitPill}>
                  <Text style={styles.benefitText}>{b}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.deco, styles.deco1]} />
            <View style={[styles.deco, styles.deco2]} />
          </View>

          {/* ── FORM ── */}
          <Animated.View style={[styles.formCard, { transform: [{ translateX: shakeAnim }] }]}>
            <Text style={styles.formTitle}>Thông tin đăng ký</Text>

            {!!error && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color="#dc2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Fullname Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Họ và tên <Text style={styles.required}>*</Text></Text>
              <View style={[styles.inputWrapper, isFocused('fullname') && styles.inputWrapperFocus]}>
                <Ionicons name="card-outline" size={18} color={isFocused('fullname') ? '#003d79' : '#94a3b8'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  placeholderTextColor="#c0c9d4"
                  value={fullname}
                  onChangeText={(t) => { setFullname(t); setError(''); }}
                  onFocus={() => setFocusField('fullname')}
                  onBlur={() => setFocusField('')}
                />
              </View>
            </View>

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email (Gmail) <Text style={styles.required}>*</Text></Text>
              <View style={[styles.inputWrapper, isFocused('email') && styles.inputWrapperFocus]}>
                <Ionicons name="mail-outline" size={18} color={isFocused('email') ? '#003d79' : '#94a3b8'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ví dụ: name@gmail.com"
                  placeholderTextColor="#c0c9d4"
                  value={email}
                  onChangeText={(t) => { setEmail(t); setError(''); }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onFocus={() => setFocusField('email')}
                  onBlur={() => setFocusField('')}
                />
              </View>
            </View>

            {/* Phone Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Số điện thoại <Text style={styles.required}>*</Text></Text>
              <View style={[styles.inputWrapper, isFocused('phone') && styles.inputWrapperFocus]}>
                <Ionicons name="call-outline" size={18} color={isFocused('phone') ? '#003d79' : '#94a3b8'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ví dụ: 0912345678"
                  placeholderTextColor="#c0c9d4"
                  value={phone}
                  onChangeText={(t) => { setPhone(t); setError(''); }}
                  keyboardType="phone-pad"
                  onFocus={() => setFocusField('phone')}
                  onBlur={() => setFocusField('')}
                />
              </View>
            </View>

            {/* Username Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tên đăng nhập <Text style={styles.required}>*</Text></Text>
              <View style={[styles.inputWrapper, isFocused('user') && styles.inputWrapperFocus]}>
                <Ionicons name="person-outline" size={18} color={isFocused('user') ? '#003d79' : '#94a3b8'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ví dụ: tuanhuy99"
                  placeholderTextColor="#c0c9d4"
                  value={username}
                  onChangeText={(t) => { setUsername(t); setError(''); }}
                  autoCapitalize="none"
                  onFocus={() => setFocusField('user')}
                  onBlur={() => setFocusField('')}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mật khẩu <Text style={styles.required}>*</Text></Text>
              <View style={[styles.inputWrapper, isFocused('pass') && styles.inputWrapperFocus]}>
                <Ionicons name="lock-closed-outline" size={18} color={isFocused('pass') ? '#003d79' : '#94a3b8'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Tối thiểu 6 ký tự"
                  placeholderTextColor="#c0c9d4"
                  value={password}
                  onChangeText={(t) => { setPassword(t); setError(''); }}
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocusField('pass')}
                  onBlur={() => setFocusField('')}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#94a3b8" />
                </TouchableOpacity>
              </View>
              {/* Strength bar */}
              {password.length > 0 && (
                <View style={styles.strengthBar}>
                  {[1, 2, 3, 4].map((s) => (
                    <View key={s} style={[
                      styles.strengthSegment,
                      password.length >= s * 2 && (password.length < 6 ? styles.strengthWeak : password.length < 10 ? styles.strengthMed : styles.strengthStrong)
                    ]} />
                  ))}
                  <Text style={styles.strengthLabel}>
                    {password.length < 6 ? 'Yêu' : password.length < 10 ? 'Trung bình' : 'Mạnh'}
                  </Text>
                </View>
              )}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Xác nhận mật khẩu <Text style={styles.required}>*</Text></Text>
              <View style={[styles.inputWrapper, isFocused('confirm') && styles.inputWrapperFocus, confirmPassword && password !== confirmPassword ? styles.inputWrapperError : null]}>
                <Ionicons name="shield-checkmark-outline" size={18} color={isFocused('confirm') ? '#003d79' : '#94a3b8'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập lại mật khẩu"
                  placeholderTextColor="#c0c9d4"
                  value={confirmPassword}
                  onChangeText={(t) => { setConfirmPassword(t); setError(''); }}
                  secureTextEntry={!showConfirm}
                  onFocus={() => setFocusField('confirm')}
                  onBlur={() => setFocusField('')}
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                  <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={18} color="#94a3b8" />
                </TouchableOpacity>
                {confirmPassword && confirmPassword === password && (
                  <Ionicons name="checkmark-circle" size={18} color="#16a34a" style={{ marginLeft: 4 }} />
                )}
              </View>
            </View>

            {/* Terms */}
            <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed(!agreed)}>
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && <Ionicons name="checkmark" size={12} color="#fff" />}
              </View>
              <Text style={styles.termsText}>
                Tôi đã đọc và đồng ý với{' '}
                <Text style={styles.termsLink}>Điều khoản dịch vụ</Text>
                {' '}và{' '}
                <Text style={styles.termsLink}>Chính sách bảo mật</Text>
                {' '}của HuyTuân Digital.
              </Text>
            </TouchableOpacity>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerBtn, loading && styles.registerBtnDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="person-add-outline" size={20} color="#fff" />
                  <Text style={styles.registerBtnText}>TẠO TÀI KHOẢN</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Divider & back to login */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ĐÃ CÓ TÀI KHOẢN?</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Ionicons name="log-in-outline" size={18} color="#003d79" />
              <Text style={styles.loginLinkText}>Đăng nhập ngay</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.footerNote}>© 2026 HuyTuân Digital. Bảo mật SSL 256-bit 🔒</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0f4c8a' },
  scroll: { flexGrow: 1, backgroundColor: '#f1f5f9' },

  successSafe: { flex: 1, backgroundColor: '#f0fdf4', justifyContent: 'center', alignItems: 'center' },
  successContainer: { alignItems: 'center', padding: 32 },
  successIcon: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center',
    marginBottom: 16, borderWidth: 3, borderColor: '#bbf7d0',
  },
  successTitle: { fontSize: 22, fontWeight: '800', color: '#15803d' },
  successSub: { fontSize: 13, color: '#4b5563', marginTop: 6, textAlign: 'center' },

  heroSection: {
    backgroundColor: '#0f4c8a',
    paddingTop: 20,
    paddingBottom: 55,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  backBtn: {
    position: 'absolute',
    top: 16, left: 16,
    width: 38, height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
    zIndex: 10,
  },
  logoWrapper: { alignItems: 'center', marginTop: 10 },
  logoCircle: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 8,
  },
  logoImage: {
    width: 44,
    height: 44,
  },
  heroTitle: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  heroSubtitle: { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 4, textAlign: 'center', paddingHorizontal: 20 },
  benefitRow: { flexDirection: 'row', gap: 6, marginTop: 14, flexWrap: 'wrap', justifyContent: 'center' },
  benefitPill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 4, paddingHorizontal: 10,
    borderRadius: 12,
  },
  benefitText: { fontSize: 10, color: '#fff', fontWeight: '600' },
  deco: { position: 'absolute', borderRadius: 999, opacity: 0.07, backgroundColor: '#fff' },
  deco1: { width: 200, height: 200, top: -60, right: -60 },
  deco2: { width: 100, height: 100, bottom: 0, left: -20 },

  formCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: -28,
    padding: 24,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12, shadowRadius: 20, elevation: 10,
  },
  formTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 16 },

  errorBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca',
    borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12,
    marginBottom: 16, gap: 8,
  },
  errorText: { flex: 1, fontSize: 12, color: '#dc2626', fontWeight: '500', lineHeight: 16 },

  inputGroup: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 6 },
  required: { color: '#d9383a' },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 10, backgroundColor: '#f8fafc',
    height: 48, paddingHorizontal: 12,
  },
  inputWrapperFocus: {
    borderColor: '#003d79', backgroundColor: '#fff',
  },
  inputWrapperError: { borderColor: '#ef4444' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 13, color: '#1e293b', paddingVertical: 10 },
  eyeBtn: { padding: 4 },

  strengthBar: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  strengthSegment: {
    flex: 1, height: 4, borderRadius: 2,
    backgroundColor: '#e2e8f0',
  },
  strengthWeak: { backgroundColor: '#ef4444' },
  strengthMed: { backgroundColor: '#f59e0b' },
  strengthStrong: { backgroundColor: '#16a34a' },
  strengthLabel: { fontSize: 9, color: '#64748b', fontWeight: '600', marginLeft: 4 },

  termsRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    marginBottom: 20, marginTop: 4,
  },
  checkbox: {
    width: 18, height: 18, borderRadius: 4,
    borderWidth: 1.5, borderColor: '#cbd5e1',
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#fff', marginTop: 1,
  },
  checkboxChecked: { backgroundColor: '#003d79', borderColor: '#003d79' },
  termsText: { flex: 1, fontSize: 11, color: '#475569', lineHeight: 16 },
  termsLink: { color: '#003d79', fontWeight: '700' },

  registerBtn: {
    height: 50, backgroundColor: '#d9383a',
    borderRadius: 12, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 10,
    shadowColor: '#d9383a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
  },
  registerBtnDisabled: { opacity: 0.7 },
  registerBtnText: { color: '#fff', fontSize: 14, fontWeight: '800', letterSpacing: 1 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 18, gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  dividerText: { fontSize: 10, color: '#94a3b8', fontWeight: '700', letterSpacing: 0.5 },

  loginLink: {
    height: 48, borderWidth: 1.5, borderColor: '#003d79',
    borderRadius: 12, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#f0f6ff',
  },
  loginLinkText: { color: '#003d79', fontSize: 13, fontWeight: '700' },

  footerNote: { textAlign: 'center', fontSize: 10, color: '#94a3b8', marginVertical: 20 },
});
