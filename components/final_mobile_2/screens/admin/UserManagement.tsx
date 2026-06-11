import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as db from '../../database/db';

export default function UserManagement({ navigation }: any) {
  const [users, setUsers] = useState<db.User[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for creating a new user
  const [showAddForm, setShowAddForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');

  // Edit/Detail Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<db.User | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editFullname, setEditFullname] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<'user' | 'admin'>('user');
  const [editPassword, setEditPassword] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await db.fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ Tên đăng nhập và Mật khẩu.');
      return;
    }

    try {
      const res = await db.addUser(
        username.trim(),
        password,
        role,
        email.trim(),
        phone.trim(),
        fullname.trim()
      );
      if (res) {
        Alert.alert('Thành công', 'Đã tạo tài khoản thành công!');
        setUsername('');
        setPassword('');
        setFullname('');
        setEmail('');
        setPhone('');
        setRole('user');
        setShowAddForm(false);
        loadUsers();
      } else {
        Alert.alert('Lỗi', 'Tên đăng nhập đã tồn tại.');
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi tạo tài khoản.');
    }
  };

  const handleOpenEdit = (user: db.User) => {
    setSelectedUser(user);
    setEditUsername(user.username);
    setEditFullname(user.fullname || '');
    setEditEmail(user.email || '');
    setEditPhone(user.phone || '');
    setEditRole(user.role as 'user' | 'admin');
    setEditPassword('');
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setSelectedUser(null);
    setEditUsername('');
    setEditFullname('');
    setEditEmail('');
    setEditPhone('');
    setEditRole('user');
    setEditPassword('');
    setShowEditModal(false);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    if (!editUsername.trim()) {
      Alert.alert('Lỗi', 'Tên đăng nhập không được để trống.');
      return;
    }

    if (selectedUser.username === 'admin' && editRole === 'user') {
      Alert.alert('Lỗi', 'Không thể hạ cấp vai trò của tài khoản Admin hệ thống mặc định!');
      return;
    }

    try {
      const success = await db.updateUserDetail(
        selectedUser.id,
        editUsername.trim(),
        editFullname.trim(),
        editEmail.trim(),
        editPhone.trim(),
        editRole,
        editPassword
      );

      if (success) {
        Alert.alert('Thành công', 'Đã cập nhật thông tin người dùng.');
        handleCloseEdit();
        loadUsers();
      } else {
        Alert.alert('Lỗi', 'Tên đăng nhập đã được sử dụng bởi người dùng khác.');
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin người dùng.');
    }
  };

  const handleDeleteUser = async (userId: number, uName: string) => {
    if (uName === 'admin') {
      Alert.alert('Lỗi', 'Không thể xóa tài khoản Admin hệ thống mặc định!');
      return;
    }

    Alert.alert(
      'Xóa người dùng',
      `Bạn chắc chắn muốn xóa tài khoản "${uName}" và toàn bộ dữ liệu đơn hàng liên quan?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.deleteUser(userId);
              Alert.alert('Thành công', 'Đã xóa người dùng.');
              loadUsers();
            } catch (err) {
              Alert.alert('Lỗi', 'Không thể xóa người dùng.');
            }
          },
        },
      ]
    );
  };

  const renderUserItem = ({ item }: { item: db.User }) => {
    return (
      <View style={styles.userCard}>
        <View style={styles.userMeta}>
          <View style={styles.avatarMini}>
            <Text style={styles.avatarText}>{item.username.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.userInfoCol}>
            <Text style={styles.username}>{item.username}</Text>
            {item.fullname ? <Text style={styles.userFullnameText}>{item.fullname}</Text> : null}
            <View style={styles.badgeRow}>
              <View style={[
                styles.roleBadge,
                { backgroundColor: item.role === 'admin' ? '#fee2e2' : '#f1f5f9' }
              ]}>
                <Text style={[
                  styles.roleText,
                  { color: item.role === 'admin' ? '#d9383a' : '#475569' }
                ]}>
                  {item.role === 'admin' ? 'Quản trị' : 'Khách hàng'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtnEdit}
            onPress={() => handleOpenEdit(item)}
          >
            <Ionicons name="create-outline" size={16} color="#003d79" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtnDelete}
            onPress={() => handleDeleteUser(item.id, item.username)}
          >
            <Ionicons name="trash-outline" size={16} color="#d9383a" />
          </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Quản lý người dùng</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Ionicons name={showAddForm ? 'close' : 'person-add'} size={22} color="#003d79" />
        </TouchableOpacity>
      </View>

      {/* ── ADD USER MODAL (FULL SCREEN) ── */}
      <Modal
        visible={showAddForm}
        animationType="slide"
        onRequestClose={() => setShowAddForm(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowAddForm(false)}>
              <Ionicons name="close" size={24} color="#334155" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Thêm người dùng mới</Text>
            <TouchableOpacity style={styles.modalSaveBtn} onPress={handleAddUser}>
              <Text style={styles.modalSaveBtnText}>Lưu</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
            <View style={styles.modalContent}>
              <View style={styles.modalAvatarSection}>
                <View style={styles.modalAvatarBig}>
                  <Ionicons name="person-add" size={32} color="#fff" />
                </View>
                <Text style={styles.modalUsernameSubtitle}>Tạo tài khoản mới trong hệ thống</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tên đăng nhập *</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Nhập tên đăng nhập"
                  placeholderTextColor="#94a3b8"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mật khẩu *</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Nhập mật khẩu tài khoản"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Họ và tên</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Nhập họ và tên tài khoản"
                  placeholderTextColor="#94a3b8"
                  value={fullname}
                  onChangeText={setFullname}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Địa chỉ Email</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Ví dụ: hotro@huytuan.vn"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Số điện thoại</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Nhập số điện thoại khách hàng"
                  placeholderTextColor="#94a3b8"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phân quyền vai trò</Text>
                <View style={styles.roleSelectRow}>
                  <TouchableOpacity
                    style={[styles.roleSelectBtn, role === 'user' && styles.roleSelectBtnActive]}
                    onPress={() => setRole('user')}
                  >
                    <Text style={[styles.roleSelectText, role === 'user' && styles.roleSelectTextActive]}>
                      Khách hàng (User)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.roleSelectBtn, role === 'admin' && styles.roleSelectBtnActive]}
                    onPress={() => setRole('admin')}
                  >
                    <Text style={[styles.roleSelectText, role === 'admin' && styles.roleSelectTextActive]}>
                      Quản trị viên (Admin)
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleAddUser}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.modalSubmitBtnText}>Tạo tài khoản mới</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowAddForm(false)}>
                <Text style={styles.modalCancelBtnText}>Quay lại danh sách</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ── EDIT USER MODAL ── */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        onRequestClose={handleCloseEdit}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={handleCloseEdit}>
              <Ionicons name="close" size={24} color="#334155" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Chi tiết người dùng</Text>
            <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveEdit}>
              <Text style={styles.modalSaveBtnText}>Lưu</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
            <View style={styles.modalContent}>
              <View style={styles.modalAvatarSection}>
                <View style={styles.modalAvatarBig}>
                  <Text style={styles.modalAvatarText}>
                    {editUsername ? editUsername.charAt(0).toUpperCase() : '?'}
                  </Text>
                </View>
                <Text style={styles.modalUsernameSubtitle}>@{editUsername}</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tên đăng nhập *</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Nhập tên đăng nhập"
                  placeholderTextColor="#94a3b8"
                  value={editUsername}
                  onChangeText={setEditUsername}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Họ và tên</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Nhập họ và tên tài khoản"
                  placeholderTextColor="#94a3b8"
                  value={editFullname}
                  onChangeText={setEditFullname}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Địa chỉ Email</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Ví dụ: hotro@huytuan.vn"
                  placeholderTextColor="#94a3b8"
                  value={editEmail}
                  onChangeText={setEditEmail}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Số điện thoại</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Nhập số điện thoại khách hàng"
                  placeholderTextColor="#94a3b8"
                  value={editPhone}
                  onChangeText={setEditPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Đặt lại mật khẩu mới (Nếu cần)</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Để trống nếu giữ nguyên mật khẩu cũ"
                  placeholderTextColor="#94a3b8"
                  value={editPassword}
                  onChangeText={setEditPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phân quyền vai trò</Text>
                <View style={styles.roleSelectRow}>
                  <TouchableOpacity
                    style={[styles.roleSelectBtn, editRole === 'user' && styles.roleSelectBtnActive]}
                    onPress={() => setEditRole('user')}
                  >
                    <Text style={[styles.roleSelectText, editRole === 'user' && styles.roleSelectTextActive]}>
                      Khách hàng (User)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.roleSelectBtn, editRole === 'admin' && styles.roleSelectBtnActive]}
                    onPress={() => setEditRole('admin')}
                  >
                    <Text style={[styles.roleSelectText, editRole === 'admin' && styles.roleSelectTextActive]}>
                      Quản trị viên (Admin)
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleSaveEdit}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.modalSubmitBtnText}>Cập nhật tài khoản</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalCancelBtn} onPress={handleCloseEdit}>
                <Text style={styles.modalCancelBtnText}>Quay lại danh sách</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#003d79" />
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
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
    backgroundColor: '#f8fafc',
  },
  header: {
    height: 55,
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
    fontSize: 16,
    fontWeight: '900',
    color: '#003d79',
  },
  addBtn: {
    padding: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 12,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  userInfoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  avatarMini: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#003d79',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
  },
  username: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  userFullnameText: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
    fontWeight: '500',
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtnEdit: {
    backgroundColor: '#e6f0fa',
    width: 32,
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnDelete: {
    backgroundColor: '#fee2e2',
    width: 32,
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addFormContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    maxHeight: 320,
  },
  formTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#003d79',
    marginBottom: 12,
  },
  formGrid: {
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    height: 38,
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
  },
  roleSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 12,
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  roleSelectBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
  },
  roleSelectBtnActive: {
    backgroundColor: '#003d79',
    borderColor: '#003d79',
  },
  roleSelectText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '700',
  },
  roleSelectTextActive: {
    color: '#fff',
  },
  submitBtn: {
    backgroundColor: '#003d79',
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    height: 55,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#003d79',
  },
  modalSaveBtn: {
    backgroundColor: '#003d79',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  modalSaveBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    padding: 20,
  },
  modalAvatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalAvatarBig: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#003d79',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalAvatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '950',
  },
  modalUsernameSubtitle: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '700',
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    height: 40,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#1e293b',
    backgroundColor: '#fff',
  },
  modalSubmitBtn: {
    backgroundColor: '#003d79',
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    shadowColor: '#003d79',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  modalSubmitBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  modalCancelBtn: {
    backgroundColor: '#f1f5f9',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  modalCancelBtnText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
});
