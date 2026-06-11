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
import * as db from '../database/db';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
interface LoginScreenProps { navigation: LoginScreenNavigationProp; }

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailFocus, setEmailFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadPreferences = async () => {
      const isRemembered = await db.getSetting('remember_me');
      if (isRemembered === 'true') {
        const savedUser = await db.getSetting('remembered_username');
        const savedPass = await db.getSetting('remembered_password');
        if (savedUser) setEmail(savedUser);
        if (savedPass) setPassword(savedPass);
        setRememberMe(true);
      }
    };
    loadPreferences();
  }, []);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = async () => {
    setError('');
    if (!email.trim()) { setError('Vui lòng nhập email hoặc tên tài khoản!'); shake(); return; }
    if (!password.trim()) { setError('Vui lòng nhập mật khẩu!'); shake(); return; }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      if (rememberMe) {
        await db.setSetting('remember_me', 'true');
        await db.setSetting('remembered_username', email.trim());
        await db.setSetting('remembered_password', password);
      } else {
        await db.setSetting('remember_me', 'false');
        await db.setSetting('remembered_username', '');
        await db.setSetting('remembered_password', '');
      }
      
      // Điều hướng dựa trên vai trò của người dùng (Admin -> Trang chủ quản trị, User -> Trang chủ người dùng)
      try {
        const loggedInUser = await db.getUserByCredentials(email.trim(), password);
        if (loggedInUser?.role === 'admin') {
          navigation.navigate('MainTabs', { screen: 'AdminTab' } as any);
        } else {
          navigation.navigate('MainTabs', { screen: 'HomeTab' } as any);
        }
      } catch (err) {
        navigation.navigate('MainTabs', { screen: 'HomeTab' } as any);
      }
    } else {
      setError(result.message);
      shake();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* ── HERO HEADER ── */}
          <View style={styles.heroSection}>
            {/* Back button */}
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>

            {/* Logo */}
            <View style={styles.logoWrapper}>
              <View style={styles.logoCircle}>
                <Image
                  source={require('../../../assets/images/logo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.brandName}>HUY TUÂN</Text>
              <Text style={styles.brandSub}>DIGITAL</Text>
              <Text style={styles.heroTagline}>Chuyên phân phối máy ảnh chính hãng</Text>
            </View>

            {/* Decorative circles */}
            <View style={[styles.deco, styles.deco1]} />
            <View style={[styles.deco, styles.deco2]} />
            <View style={[styles.deco, styles.deco3]} />
          </View>

          {/* ── FORM CARD ── */}
          <Animated.View style={[styles.formCard, { transform: [{ translateX: shakeAnim }] }]}>
            <Text style={styles.formTitle}>Đăng nhập</Text>
            <Text style={styles.formSubtitle}>Chào mừng bạn quay lại! Đăng nhập để tiếp tục mua sắm.</Text>

            {/* Error banner */}
            {!!error && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color="#dc2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email / Tên tài khoản <Text style={styles.required}>*</Text></Text>
              <View style={[styles.inputWrapper, emailFocus && styles.inputWrapperFocus]}>
                <Ionicons name="mail-outline" size={18} color={emailFocus ? '#003d79' : '#94a3b8'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="nhập địa chỉ email..."
                  placeholderTextColor="#c0c9d4"
                  value={email}
                  onChangeText={(t) => { setEmail(t); setError(''); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mật khẩu <Text style={styles.required}>*</Text></Text>
              <View style={[styles.inputWrapper, passFocus && styles.inputWrapperFocus]}>
                <Ionicons name="lock-closed-outline" size={18} color={passFocus ? '#003d79' : '#94a3b8'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="nhập mật khẩu..."
                  placeholderTextColor="#c0c9d4"
                  value={password}
                  onChangeText={(t) => { setPassword(t); setError(''); }}
                  secureTextEntry={!showPassword}
                  onFocus={() => setPassFocus(true)}
                  onBlur={() => setPassFocus(false)}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember me & Forgot */}
            <View style={styles.optionsRow}>
              <TouchableOpacity style={styles.rememberRow} onPress={() => setRememberMe(!rememberMe)}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Ionicons name="checkmark" size={12} color="#fff" />}
                </View>
                <Text style={styles.rememberText}>Ghi nhớ đăng nhập</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.forgotText}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="log-in-outline" size={20} color="#fff" />
                  <Text style={styles.loginBtnText}>ĐĂNG NHẬP</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Hint */}
            <View style={styles.hintBox}>
              <Ionicons name="information-circle-outline" size={14} color="#64748b" />
              <Text style={styles.hintText}>Demo: Email <Text style={styles.hintBold}>huy@gmail.com</Text> | Mật khẩu <Text style={styles.hintBold}>123456</Text></Text>
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>HOẶC</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Register link */}
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.8}
            >
              <Ionicons name="person-add-outline" size={18} color="#003d79" />
              <Text style={styles.registerBtnText}>Tạo tài khoản mới</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer */}
          <Text style={styles.footerNote}>© 2026 HuyTuân Digital. Bảo mật SSL 256-bit.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#003d79' },
  scroll: { flexGrow: 1, backgroundColor: '#f1f5f9' },

  // ── HERO ──
  heroSection: {
    backgroundColor: '#003d79',
    paddingTop: 20,
    paddingBottom: 60,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  logoWrapper: { alignItems: 'center', marginTop: 12 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  logoImage: {
    width: 48,
    height: 48,
  },
  brandName: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: 3 },
  brandSub: { fontSize: 12, fontWeight: '700', color: '#d9383a', letterSpacing: 5, marginTop: -2 },
  heroTagline: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 8, letterSpacing: 0.3 },
  deco: { position: 'absolute', borderRadius: 999, opacity: 0.08, backgroundColor: '#fff' },
  deco1: { width: 180, height: 180, top: -40, right: -50 },
  deco2: { width: 120, height: 120, bottom: 10, left: -30 },
  deco3: { width: 60, height: 60, top: 40, left: 60 },

  // ── FORM CARD ──
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: -30,
    padding: 24,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
  formTitle: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  formSubtitle: { fontSize: 14, color: '#64748b', marginBottom: 20, lineHeight: 17 },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: { flex: 1, fontSize: 12, color: '#dc2626', fontWeight: '500', lineHeight: 16 },

  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 6 },
  required: { color: '#d9383a' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    height: 48,
    paddingHorizontal: 12,
  },
  inputWrapperFocus: {
    borderColor: '#003d79',
    backgroundColor: '#fff',
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#1e293b', paddingVertical: 10 },
  eyeBtn: { padding: 4 },

  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  rememberRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: { backgroundColor: '#003d79', borderColor: '#003d79' },
  rememberText: { fontSize: 14, color: '#475569' },
  forgotText: { fontSize: 14, color: '#003d79', fontWeight: '600' },

  loginBtn: {
    height: 50,
    backgroundColor: '#003d79',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#003d79',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnText: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 1 },

  hintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 10,
    marginTop: 14,
    gap: 6,
  },
  hintText: { flex: 1, fontSize: 11, color: '#475569', lineHeight: 15 },
  hintBold: { fontWeight: '700', color: '#003d79' },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  dividerText: { fontSize: 13, color: '#94a3b8', fontWeight: '700', letterSpacing: 1 },

  registerBtn: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#003d79',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f0f6ff',
  },
  registerBtnText: { color: '#003d79', fontSize: 15, fontWeight: '700' },

  footerNote: {
    textAlign: 'center',
    fontSize: 10,
    color: '#94a3b8',
    marginVertical: 20,
  },
});
