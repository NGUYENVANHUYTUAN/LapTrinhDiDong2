/**
 * db.web.ts
 * Phiên bản web dùng localStorage để persist data (thay in-memory).
 * Tương thích hoàn toàn với db.ts (SQLite) về API.
 */

export type Category = { id: number; name: string };
export type Product = { id: number; name: string; price: number; img: string; categoryId: number };
export type User = {
  id: number;
  username: string;
  password: string;
  role: string;
  email?: string;
  phone?: string;
  fullname?: string;
  address?: string;
};
export type CartItem = { id: number; userId: number; productId: number; quantity: number; name?: string; price?: number; img?: string };
export type Order = { id: number; userId: number; totalPrice: number; orderDate: string; status: string; address: string; phone: string; username?: string };
export type OrderItem = { id: number; orderId: number; productId: number; quantity: number; price: number; productName?: string };

// ─── LocalStorage helpers ────────────────────────────────────────────────────
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function save(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ─── Khởi tạo dữ liệu mặc định nếu chưa có ──────────────────────────────────
const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: 'Máy ảnh' },
  { id: 2, name: 'Ống kính' },
  { id: 3, name: 'Phụ kiện' },
  { id: 4, name: 'Balo - Túi' },
  { id: 5, name: 'Flycam' },
];

import { products as staticProducts } from '../data/products';

const resolveCategoryId = (brand: string): number => {
  if (brand === 'Lenses') return 2;
  if (brand === 'Flycam') return 5;
  if (brand === 'Phụ kiện' || brand === 'Skin' || brand === 'Micro' || brand === 'Gimbal' || brand === 'Action Camera') return 3;
  if (brand === 'OM System' || brand === 'Canon' || brand === 'Nikon' || brand === 'Sony' || brand === 'Fujifilm') return 1;
  return 3;
};

const DEFAULT_PRODUCTS: Product[] = staticProducts.map((p, idx) => ({
  id: idx + 1,
  name: p.name,
  price: p.price,
  img: p.image,
  categoryId: resolveCategoryId(p.brand)
}));

const DEFAULT_USERS: User[] = [
  { id: 1, username: 'admin', password: '123456', role: 'admin' },
  { id: 2, username: 'user1', password: '123456', role: 'user' },
  { id: 3, username: 'user2', password: '123456', role: 'user' },
  { id: 4, username: 'huy@gmail.com', password: '123456', role: 'user' },
];

// ─── Getters/Setters (luôn đọc từ localStorage) ───────────────────────────────
const getCategories  = () => load<Category[]>('db_categories_final',  DEFAULT_CATEGORIES);
const getProducts    = () => load<Product[]>('db_products_final',     DEFAULT_PRODUCTS);
const getUsers       = () => load<User[]>('db_users_final',           DEFAULT_USERS);
const getCart        = () => load<{ id: number; userId: number; productId: number; quantity: number }[]>('db_cart_final', []);
const getOrders      = () => load<Order[]>('db_orders_final',         []);
const getOrderItems  = () => load<OrderItem[]>('db_order_items_final',[]);

const setCategories  = (v: Category[])  => save('db_categories_final',  v);
const setProducts    = (v: Product[])   => save('db_products_final',     v);
const setUsers       = (v: User[])      => save('db_users_final',        v);
const setCart        = (v: any[])       => save('db_cart_final',         v);
const setOrders      = (v: Order[])     => save('db_orders_final',       v);
const setOrderItems  = (v: OrderItem[]) => save('db_order_items_final',  v);

const nextId = (items: { id: number }[]) => items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;

// ─── Init ─────────────────────────────────────────────────────────────────────
export const initDatabase = async (onSuccess?: () => void): Promise<void> => {
  if (!localStorage.getItem('db_categories_final')) setCategories(DEFAULT_CATEGORIES);
  
  const currentProds = load<Product[]>('db_products_final', []);
  if (currentProds.length < 20) {
    setProducts(DEFAULT_PRODUCTS);
  }
  
  if (!localStorage.getItem('db_users_final')) {
    setUsers(DEFAULT_USERS);
  } else {
    // Tự động chèn thêm tài khoản mới nếu chưa tồn tại trong localStorage
    const currentUsers = getUsers();
    let changed = false;
    for (const du of DEFAULT_USERS) {
      if (!currentUsers.some(u => u.username === du.username)) {
        currentUsers.push({
          id: nextId(currentUsers),
          username: du.username,
          password: du.password,
          role: du.role,
        });
        changed = true;
      }
    }
    if (changed) {
      setUsers(currentUsers);
    }
  }
  console.log('✅ [Web/localStorage] Database ready');
  onSuccess?.();
};

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
export const fetchCategories = async (): Promise<Category[]> =>
  [...getCategories()].sort((a, b) => a.id - b.id);

export const addCategory = async (name: string): Promise<boolean> => {
  const cats = getCategories();
  cats.push({ id: nextId(cats), name });
  setCategories(cats);
  return true;
};

export const updateCategory = async (category: Category): Promise<boolean> => {
  const cats = getCategories().map(c => c.id === category.id ? category : c);
  setCategories(cats);
  return true;
};

export const deleteCategory = async (id: number): Promise<boolean> => {
  setCategories(getCategories().filter(c => c.id !== id));
  setProducts(getProducts().filter(p => p.categoryId !== id));
  return true;
};

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
export const fetchProducts = async (): Promise<Product[]> =>
  [...getProducts()].sort((a, b) => b.id - a.id);

export const addProduct = async (product: Omit<Product, 'id'>) => {
  const prods = getProducts();
  prods.push({ id: nextId(prods), ...product });
  setProducts(prods);
};

export const updateProduct = async (product: Product) => {
  setProducts(getProducts().map(p => p.id === product.id ? product : p));
};

export const deleteProduct = async (id: number) => {
  setProducts(getProducts().filter(p => p.id !== id));
};

export const fetchProductsByCategory = async (categoryId: number): Promise<Product[]> =>
  getProducts().filter(p => p.categoryId === categoryId).sort((a, b) => b.id - a.id);

export const searchProductsByNameOrCategory = async (keyword: string): Promise<Product[]> => {
  const k = keyword.toLowerCase();
  const cats = getCategories();
  return getProducts().filter(p => {
    const cat = cats.find(c => c.id === p.categoryId);
    return p.name.toLowerCase().includes(k) || (cat?.name.toLowerCase().includes(k) ?? false);
  }).sort((a, b) => b.id - a.id);
};

export const fetchProductsByPriceRange = async (min: number, max: number): Promise<Product[]> =>
  getProducts().filter(p => p.price >= min && p.price <= max).sort((a, b) => a.price - b.price);

// ─── USERS ────────────────────────────────────────────────────────────────────
export const addUser = async (
  username: string,
  password: string,
  role: string,
  email?: string,
  phone?: string,
  fullname?: string
): Promise<boolean> => {
  const users = getUsers();
  if (users.some(u => u.username === username)) return false;
  users.push({
    id: nextId(users),
    username,
    password,
    role,
    email: email ?? '',
    phone: phone ?? '',
    fullname: fullname ?? ''
  });
  setUsers(users);
  return true;
};

export const fetchUsers = async (): Promise<User[]> =>
  [...getUsers()].sort((a, b) => a.id - b.id);

export const getUserByCredentials = async (username: string, password: string): Promise<User | null> =>
  getUsers().find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password) ?? null;

export const deleteUser = async (id: number): Promise<boolean> => {
  setUsers(getUsers().filter(u => u.id !== id));
  setCart(getCart().filter(c => c.userId !== id));
  setOrders(getOrders().filter(o => o.userId !== id));
  return true;
};

export const updateUserRole = async (id: number, role: string): Promise<boolean> => {
  setUsers(getUsers().map(u => u.id === id ? { ...u, role } : u));
  return true;
};

export const updateUserDetail = async (
  id: number,
  username: string,
  fullname: string,
  email: string,
  phone: string,
  role: string,
  address: string,
  password?: string
): Promise<boolean> => {
  setUsers(getUsers().map(u => {
    if (u.id !== id) return u;
    return {
      ...u,
      username,
      fullname,
      email,
      phone,
      role,
      address,
      ...(password && password.trim() ? { password } : {})
    };
  }));
  return true;
};

export const updateUserProfile = async (
  id: number,
  username: string,
  fullname: string,
  email: string,
  phone: string,
  address: string,
  password?: string
): Promise<boolean> => {
  setUsers(getUsers().map(u => {
    if (u.id !== id) return u;
    return {
      ...u,
      username,
      fullname,
      email,
      phone,
      address,
      ...(password && password.trim() ? { password } : {})
    };
  }));
  return true;
};

// ─── CART ─────────────────────────────────────────────────────────────────────
export const addToCart = async (userId: number, productId: number, quantity: number): Promise<void> => {
  const cart = getCart();
  const existing = cart.find(c => c.userId === userId && c.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: nextId(cart), userId, productId, quantity });
  }
  setCart(cart);
};

export const fetchCart = async (userId: number): Promise<CartItem[]> => {
  const prods = getProducts();
  return getCart()
    .filter(c => c.userId === userId)
    .map(c => {
      const p = prods.find(prod => prod.id === c.productId);
      return {
        id: c.id, userId: c.userId, productId: c.productId, quantity: c.quantity,
        name: p?.name ?? 'Sản phẩm đã xóa',
        price: p?.price ?? 0,
        img: p?.img ?? 'hinh1.jpg',
      };
    });
};

export const updateCartQuantity = async (cartId: number, quantity: number): Promise<void> => {
  if (quantity <= 0) {
    setCart(getCart().filter(c => c.id !== cartId));
  } else {
    setCart(getCart().map(c => c.id === cartId ? { ...c, quantity } : c));
  }
};

export const removeFromCart = async (cartId: number): Promise<void> => {
  setCart(getCart().filter(c => c.id !== cartId));
};

export const clearCart = async (userId: number): Promise<void> => {
  setCart(getCart().filter(c => c.userId !== userId));
};

// ─── ORDERS ───────────────────────────────────────────────────────────────────
export const createOrder = async (
  userId: number,
  items: { productId: number; quantity: number; price: number }[],
  address: string,
  phone: string,
  totalPrice: number
): Promise<number> => {
  const orders = getOrders();
  const orderItems = getOrderItems();

  const orderId = nextId(orders);
  const orderDate = new Date().toISOString();

  orders.push({ id: orderId, userId, totalPrice, orderDate, status: 'Đang xử lý', address, phone });
  setOrders(orders);

  const newItems: OrderItem[] = items.map((item, i) => ({
    id: nextId(orderItems) + i,
    orderId,
    productId: item.productId,
    quantity: item.quantity,
    price: item.price,
  }));
  setOrderItems([...orderItems, ...newItems]);

  await clearCart(userId);
  return orderId;
};

export const fetchUserOrders = async (userId: number): Promise<any[]> => {
  const prods = getProducts();
  const allItems = getOrderItems();

  return getOrders()
    .filter(o => o.userId === userId)
    .sort((a, b) => b.id - a.id)
    .map(o => {
      const items = allItems
        .filter(oi => oi.orderId === o.id)
        .map(oi => ({
          ...oi,
          productName: prods.find(p => p.id === oi.productId)?.name ?? 'Sản phẩm đã xóa',
        }));
      return { ...o, items };
    });
};

export const fetchAllOrders = async (): Promise<any[]> => {
  const users = getUsers();
  const prods = getProducts();
  const allItems = getOrderItems();

  return getOrders()
    .sort((a, b) => b.id - a.id)
    .map(o => {
      const u = users.find(user => user.id === o.userId);
      const items = allItems
        .filter(oi => oi.orderId === o.id)
        .map(oi => ({
          ...oi,
          productName: prods.find(p => p.id === oi.productId)?.name ?? 'Sản phẩm đã xóa',
        }));
      return { ...o, username: u?.username ?? 'Người dùng đã xóa', items };
    });
};

export const updateOrderStatus = async (orderId: number, status: string): Promise<void> => {
  setOrders(getOrders().map(o => o.id === orderId ? { ...o, status } : o));
};

// ==========================================
// PERSISTENT PREFERENCES / SETTINGS
// ==========================================
export const getSetting = async (key: string): Promise<string | null> => {
  return localStorage.getItem(`setting_${key}`);
};

export const setSetting = async (key: string, value: string): Promise<void> => {
  localStorage.setItem(`setting_${key}`, value);
};
