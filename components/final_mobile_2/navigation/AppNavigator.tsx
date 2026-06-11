import React from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth, AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { RootStackParamList, MainTabParamList } from './types';

// Screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';

// Admin Screens
import AdminDashboard from '../screens/admin/AdminDashboard';
import UserManagement from '../screens/admin/UserManagement';
import CategoryManagement from '../screens/admin/CategoryManagement';
import ProductManagement from '../screens/admin/ProductManagement';
import OrderManagement from '../screens/admin/OrderManagement';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabNavigator() {
  const { totalCount } = useCart();
  const { user, isLoggedIn } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'SearchTab') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'CartTab') iconName = focused ? 'cart' : 'cart-outline';
          else if (route.name === 'ProfileTab') iconName = focused ? 'person' : 'person-outline';
          else if (route.name === 'OrdersTab') iconName = focused ? 'document-text' : 'document-text-outline';
          else if (route.name === 'AdminTab') iconName = focused ? 'settings' : 'settings-outline';
          else if (route.name === 'RegisterTab') iconName = focused ? 'person-add' : 'person-add-outline';
          else if (route.name === 'LoginTab') iconName = focused ? 'log-in' : 'log-in-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#003d79',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e9ecef',
          ...Platform.select({
            web: {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 65,
            },
            default: {
              height: 82,
              paddingBottom: 22,
              paddingTop: 10,
            }
          })
        },
        tabBarItemStyle: Platform.select({
          web: {
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
          },
          default: undefined
        }),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          ...Platform.select({
            web: {
              marginTop: 2,
              marginBottom: 0,
            },
            default: {
              marginBottom: 6,
            }
          })
        },
        headerShown: false,
      })}
    >
      {/* 1. Trang chủ luôn có sẵn cho mọi vai trò */}
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Trang chủ' }} />

      {/* 2. Điều hướng Tabs dựa trên phân quyền theo yêu cầu */}
      {!isLoggedIn ? (
        // CHƯA ĐĂNG NHẬP: Home | Signup | Login
        <>
          <Tab.Screen name="RegisterTab" component={RegisterScreen} options={{ title: 'Đăng ký' }} />
          <Tab.Screen name="LoginTab" component={LoginScreen} options={{ title: 'Đăng nhập' }} />
        </>
      ) : user?.role === 'admin' ? (
        // ADMIN: Trang chủ | Quản trị | Cá nhân
        <>
          <Tab.Screen name="AdminTab" component={AdminDashboard} options={{ title: 'Quản trị' }} />
          <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Cá nhân' }} />
        </>
      ) : (
        // USER THƯỜNG: Home | Giỏ hàng | Đơn hàng | Cá nhân
        <>
          <Tab.Screen name="SearchTab" component={SearchScreen} options={{ title: 'Tìm kiếm' }} />
          <Tab.Screen
            name="CartTab"
            component={CartScreen}
            options={{
              title: 'Giỏ hàng',
              tabBarBadge: totalCount > 0 ? totalCount : undefined,
              tabBarBadgeStyle: { backgroundColor: '#d9383a', color: '#fff', fontSize: 10 },
            }}
          />
          <Tab.Screen name="OrdersTab" component={OrderHistoryScreen} options={{ title: 'Đơn hàng' }} />
          <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Cá nhân' }} />
        </>
      )}
    </Tab.Navigator>
  );
}

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ animation: 'slide_from_right' }}
      />
      {/* Admin Stacks */}
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="UserManagement" component={UserManagement} />
      <Stack.Screen name="CategoryManagement" component={CategoryManagement} />
      <Stack.Screen name="ProductManagement" component={ProductManagement} />
      <Stack.Screen name="OrderManagement" component={OrderManagement} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationIndependentTree>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </NavigationIndependentTree>
      </CartProvider>
    </AuthProvider>
  );
}
