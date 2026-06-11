import React, { createContext, useContext, useState, useEffect } from 'react';
import { initDatabase, getUserByCredentials, addUser, updateUserProfile, User } from '../database/db';
import { View, ActivityIndicator, Text } from 'react-native';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (username: string, password: string, email: string, phone: string, fullname: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (
    username: string,
    fullname: string,
    email: string,
    phone: string,
    address: string,
    password?: string
  ) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    // Khởi tạo database SQLite khi bắt đầu ứng dụng
    initDatabase(() => {
      setDbReady(true);
    });
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const found = await getUserByCredentials(username.trim(), password);
      if (found) {
        setUser(found);
        return { success: true, message: `Chào mừng trở lại, ${found.username}!` };
      }
      return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' };
    } catch (error) {
      return { success: false, message: 'Lỗi đăng nhập hệ thống.' };
    }
  };

  const register = async (
    username: string,
    password: string,
    email: string,
    phone: string,
    fullname: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const success = await addUser(username.trim(), password, 'user', email.trim(), phone.trim(), fullname.trim());
      if (success) {
        // Đăng nhập luôn sau khi đăng ký thành công
        const found = await getUserByCredentials(username.trim(), password);
        if (found) {
          setUser(found);
        }
        return { success: true, message: 'Đăng ký tài khoản thành công!' };
      }
      return { success: false, message: 'Tên đăng nhập đã tồn tại.' };
    } catch (error) {
      return { success: false, message: 'Lỗi hệ thống khi đăng ký.' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (
    username: string,
    fullname: string,
    email: string,
    phone: string,
    address: string,
    password?: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'Vui lòng đăng nhập.' };
    try {
      const success = await updateUserProfile(
        user.id,
        username.trim(),
        fullname.trim(),
        email.trim(),
        phone.trim(),
        address.trim(),
        password
      );
      if (success) {
        setUser({
          ...user,
          username: username.trim(),
          fullname: fullname.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
        });
        return { success: true, message: 'Cập nhật thông tin thành công!' };
      }
      return { success: false, message: 'Không thể cập nhật thông tin.' };
    } catch (error) {
      return { success: false, message: 'Lỗi hệ thống khi cập nhật.' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, logout, updateProfile }}>
      {!dbReady ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
          <ActivityIndicator size="large" color="#003d79" />
          <Text style={{ marginTop: 12, color: '#003d79', fontSize: 13, fontWeight: '700' }}>
            Đang khởi tạo cơ sở dữ liệu...
          </Text>
        </View>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
