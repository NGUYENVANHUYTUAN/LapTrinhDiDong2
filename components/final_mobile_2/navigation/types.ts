import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  HomeTab: undefined;
  SearchTab: { query?: string } | undefined;
  CartTab: undefined;
  ProfileTab: undefined;
  OrdersTab: undefined;
  AdminTab: undefined;
  RegisterTab: undefined;
  LoginTab: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  ProductDetails: { productId: number };
  CategoryProducts: { categoryId: number; categoryName: string };
  Checkout: undefined;
  OrderSuccess: { orderId: number; total: number; name: string };
  Login: undefined;
  Register: undefined;
  AdminDashboard: undefined;
  UserManagement: undefined;
  CategoryManagement: undefined;
  ProductManagement: undefined;
  OrderManagement: undefined;
  OrderHistory: undefined;
};
